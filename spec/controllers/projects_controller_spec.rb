require 'rails_helper'

describe ProjectsController do
  context 'when logged out' do
    %w[index new create archived].each do |action|
      specify do
        get action
        expect(response).to redirect_to(new_user_session_url)
      end
    end

    %w[
      show
      edit
      update
      destroy
      reports
      import
      import_upload
      archive
      unarchive
      ownership
      join
    ].each do |action|
      specify do
        get action, params: { id: 42 }
        expect(response).to redirect_to(new_user_session_url)
      end
    end
  end

  context 'when logged in' do
    context 'as non-admin' do
      let(:user)            { create :user, :with_team, email: 'user@example.com' }
      let(:team)            { user.teams.first }
      let(:project)         { create(:project, users: [user]) }
      let(:another_project) { create(:project) }
      let!(:story)          { create(:story, project: project, requested_by: user) }

      before do
        team.ownerships.create(project: project, is_owner: true)
        team.ownerships.create(project: another_project, is_owner: true)
        sign_in user
        allow(subject).to receive_messages(current_user: user, current_team: team)
      end

      describe 'collection actions' do
        describe '#index' do
          specify do
            get :index
            expect(response).to be_successful
          end
        end

        describe '#join' do
          context 'with public project' do
            let(:public_project) { create(:project, disallow_join: false) }

            before do
              team.ownerships.create(project: public_project, is_owner: true)
              get :join, params: { id: public_project.slug }
            end

            it 'should join to the project' do
              expect(user.projects).to include(public_project)
            end

            it { expect(response).to redirect_to(public_project) }
            it { expect(flash[:notice]).to eq('user@example.com was added to this project') }
          end

          context 'with private project' do
            let(:private_project) { create(:project, disallow_join: true) }

            before do
              team.ownerships.create(project: private_project, is_owner: true)

              get :join, params: { id: private_project.slug }
            end

            it 'should not join to the project' do
              get :join, params: { id: private_project.slug }

              expect(user.projects).not_to eq(private_project)
            end

            it { expect(response).not_to redirect_to(private_project) }
            it { expect(response).to redirect_to(root_url) }
          end
        end
      end
    end

    context 'as admin' do
      let(:user)            { create :user, :with_team_and_is_admin }
      let(:team)            { user.teams.first }
      let(:project)         { create(:project, users: [user]) }
      let(:another_project) { create(:project) }
      let!(:story)          { create(:story, project: project, requested_by: user) }

      before do
        team.ownerships.create(project: project, is_owner: true)
        team.ownerships.create(project: another_project, is_owner: true)
        sign_in user
        allow(subject).to receive_messages(current_user: user, current_team: team)
      end

      describe 'collection actions' do
        describe '#index' do
          specify do
            get :index
            expect(response).to be_successful
          end
        end

        describe '#new' do
          specify do
            get :new
            expect(response).to be_successful
            expect(assigns[:project]).to be_new_record
          end
        end

        describe '#create' do
          let(:project_params) { { 'name' => 'Test Project', 'mail_reports' => '0' } }

          specify do
            post :create, params: { project: project_params }
            expect(assigns[:project].name).to eq(project_params['name'])
            expect(assigns[:project].users).to include(user)
            expect(assigns[:project].teams).to include(user.teams.first)
            expect(assigns[:project].mail_reports).to be_falsey
            expect(team.owns?(assigns[:project])).to be_truthy
          end

          context 'when save succeeds' do
            specify do
              post :create, params: { project: project_params }
              expect(response).to redirect_to(project_url(assigns[:project]))
              expect(flash[:notice]).to eq('Project was successfully created.')
            end
          end

          context 'when save fails' do
            specify do
              post :create, params: { project: { name: nil } }
              expect(response).to be_successful
              expect(response).to render_template('new')
            end
          end
        end

        describe '#archived' do
          let(:archived_project) { create :project, archived_at: Time.current }

          before do
            create :ownership, team: user.teams.first, project: archived_project
            get :archived
          end

          it 'returns success' do
            expect(response).to be_successful
          end

          it 'assigns projects' do
            expect(assigns[:projects]).to include archived_project
          end
        end
      end

      describe 'member actions' do
        before do
          allow(project).to receive(:"import=").and_return(nil)
        end

        describe '#show' do
          context 'as html' do
            specify do
              get :show, params: {id: project.id }
              expect(response).to be_successful
              expect(assigns[:project]).to eq(project)
              expect(assigns[:story].new_record?).to be_truthy
              expect(assigns[:story].project).to eq(project)
            end
          end

          context 'as json' do
            specify do
              get :show, xhr: true, params: { id: project.id }
              expect(response).to be_successful
              expect(assigns[:project]).to eq(project)
              expect(assigns[:story].new_record?).to be_truthy
              expect(assigns[:story].project).to eq(project)
            end
          end

          describe 'when the user change to another project from another team' do
            let(:new_team)              { create :team }
            let(:new_project)           { create :project, users: [user] }
            let!(:new_team_projects)    { new_team.projects << new_project }
            let(:second_team)           { create :team }
            let(:second_project)        { create :project, users: [user] }
            let!(:second_team_projects) { second_team.projects << second_project }
            let!(:user_add_teams)       { user.teams << [new_team, second_team] }

            it 'should accept request when it is from registred team', :aggregate_failures do
              get :show, params: { id: new_project }

              expect(session[:current_team_slug]).to eq(new_team.slug)
              expect(response).to have_http_status(:ok)
            end

            it 'should change session when change most oneteams', :aggregate_failures do
              get :show, params: { id: new_project }

              expect(session[:current_team_slug]).to eq(new_team.slug)
              expect(response).to have_http_status(:ok)

              get :show, params: { id: second_project }

              expect(session[:current_team_slug]).to eq(second_team.slug)
              expect(response).to have_http_status(:ok)
            end
          end
        end

        describe '#edit' do
          specify do
            get :edit, params: { id: project.id }
            expect(response).to be_successful
            expect(assigns[:project]).to eq(project)
          end
        end

        describe '#update' do
          let(:project_params) { { name: 'New Project Title' } }

          specify do
            put :update, params: { id: project.id, project: project_params }
            expect(assigns[:project].name).to eq('New Project Title')
          end

          context 'when update succeeds' do
            specify do
              put :update, params: { id: project.id, project: project_params }
              expect(response).to redirect_to(project_url(assigns[:project]))
            end
          end

          context 'when update fails' do
            specify do
              put :update, params: { id: project.id, project: {point_scale: 'xyz'} }
              expect(response).to be_successful
              expect(response).to render_template('edit')
            end
          end
        end

        describe '#join' do
          specify do
            get :join, params: { id: project.slug }
            expect(response).to redirect_to(root_url)
          end
        end

        describe '#archive' do
          specify do
            patch :archive, params: { id: project.id }
            expect(assigns[:project].archived_at).not_to be_nil
            expect(response).to redirect_to(projects_url)
          end
        end

        describe '#unarchive' do
          before { project.update(archived_at: Time.current) }

          specify do
            patch :unarchive, params: { id: project.id }
            expect(assigns[:project].archived_at).to be_nil
            expect(response).to redirect_to(project_url(assigns[:project]))
          end
        end

        describe '#destroy' do
          context 'when project name_confirmation is invalid' do
            specify do
              delete :destroy, params: { id: project.id, name_confirmation: "wrong#{project.name}" }
              expect(response).to redirect_to(edit_project_path)
            end
          end

          context 'when project name_confirmation is valid' do
            specify do
              delete :destroy, params: { id: project.id, name_confirmation: project.name }
              expect(response).to redirect_to(projects_url)
            end
          end
        end

        describe '#import' do
          context 'when no job is running' do
            specify do
              get :import, params: { id: project.id }
              expect(response).to be_successful
              expect(assigns[:project]).to eq(project)
              expect(response).to render_template('import')
            end
          end

          context 'when there is a job registered' do
            context 'still unprocessed' do
              before do
                session[:import_job] = { id: 'foo', created_at: 10.minutes.ago }
              end

              specify do
                get :import, params: { id: project.id }
                expect(assigns[:valid_stories]).to be_nil
                expect(session[:import_job]).not_to be_nil
                expect(response).to render_template('import')
              end
            end

            context 'unprocessed for more than 60 minutes' do
              before do
                session[:import_job] = { id: 'foo', created_at: 2.hours.ago }
              end

              specify do
                get :import, params: { id: project.id }
                expect(assigns[:valid_stories]).to be_nil
                expect(session[:import_job]).to be_nil
                expect(response).to render_template('import')
              end
            end

            context 'finished with errors' do
              let(:error) { 'Bad CSV!' }
              before do
                session[:import_job] = { id: 'foo', created_at: 5.minutes.ago }
                expect(Rails.cache)
                  .to receive(:read)
                  .with('foo')
                  .and_return(invalid_stories: [], errors: error)
              end
              specify do
                get :import, params: { id: project.id }
                expect(assigns[:valid_stories]).to be_nil
                expect(flash[:alert]).to eq('Unable to import CSV: Bad CSV!')
                expect(session[:import_job]).to be_nil
                expect(response).to render_template('import')
              end
            end

            context 'finished with success' do
              let(:invalid_story) { { title: 'hello', errors: 'bad cookie' } }
              before do
                session[:import_job] = { id: 'foo', created_at: 5.minutes.ago }
                expect(Rails.cache)
                  .to receive(:read)
                  .with('foo')
                  .and_return(invalid_stories: [invalid_story], errors: nil)
              end

              specify do
                get :import, params: { id: project.id }
                expect(assigns[:valid_stories]).to eq([story])
                expect(assigns[:invalid_stories]).to eq([invalid_story])
                expect(flash[:notice]).to eq('Imported 1 story')
                expect(session[:import_job]).to be_nil
                expect(response).to render_template('import')
              end
            end
          end
        end

        describe '#import_upload' do
          context 'when csv file is missing' do
            specify do
              put :import_upload, params: { id: project.id }
              expect(response).to redirect_to(import_project_path(project))
              expect(flash[:alert])
                .to eq('You must select a CSV file to import its stories to the project.')
            end
          end

          context 'when csv file is present' do
            let(:csv) { fixture_file_upload('csv/stories.csv') }

            before do
              expect(project).to receive(:update).and_return(true)
            end

            specify do
              expect(Project)
                .to receive_message_chain(:friendly, :find)
                .with(project.id.to_s)
                .and_return(project)

              expect(ImportWorker).to receive(:perform_async)
              put :import_upload, params: { id: project.id, project: { import: csv } }

              expect(flash[:notice]).to eq(
                'Your uploaded CSV file is being processed. You can come back here ' \
                'later when the process is finished.'
              )

              expect(response).to redirect_to(import_project_path(project))
            end
          end
        end

        describe '#ownership' do
          let!(:another_admin) { create :user, :with_team_and_is_admin }
          let!(:another_team) { another_admin.teams.first }

          context 'when sharing/unsharing' do
            specify do
              patch(
                :ownership,
                params: {
                  id: project.id,
                  project: { slug: another_team.slug },
                  ownership_action: 'share'
                }
              )

              expect(team.ownerships.where(project: project).count).to be(1)
              expect(another_team.ownerships.where(project: project).count).to be(1)
              expect(response).to redirect_to(edit_project_path(assigns[:project]))

              patch(
                :ownership,
                params: {
                  id: project.id,
                  project: { slug: another_team.slug },
                  ownership_action: 'unshare'
                }
              )

              expect(team.ownerships.where(project: project).count).to be(1)
              expect(another_team.ownerships.where(project: project).count).to be(0)
              expect(response).to redirect_to(edit_project_path(assigns[:project]))
            end
          end

          context 'when transfering' do
            specify do
              patch(
                :ownership,
                params: {
                  id: project.id,
                  project: { slug: another_team.slug },
                  ownership_action: 'transfer'
                }
              )

              expect(another_team.owns?(project)).to be_truthy
              expect(team.owns?(project)).to be_falsey
              expect(another_team.users).to eq([another_admin])
              expect(response).to redirect_to(root_path)
            end
          end
        end
      end
    end
  end
end
