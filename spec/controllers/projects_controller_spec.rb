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
    ].each do |action|
      specify do
        get action, params: { id: 42 }
        expect(response).to redirect_to(new_user_session_url)
      end
    end
  end

  context 'when logged in' do
    context 'as non-admin' do
      let(:user)            { create :user, email: 'user@example.com' }
      let(:project)         { create(:project, users: [user]) }
      let(:another_project) { create(:project) }
      let!(:story)          { create(:story, project: project, requested_by: user) }

      before do
        sign_in user
        allow(subject).to receive_messages(current_user: user, current_project: project)
      end

      describe 'collection actions' do
        describe '#index' do
          it "redirects to project page when there's only one" do
            get :index
            expect(response).to redirect_to(project_url(project))
          end
        end
      end
    end

    context 'as admin' do
      let(:user)            { create :user, :admin }
      let(:project)         { create(:project, users: [user]) }
      let(:another_project) { create(:project) }
      let!(:story)          { create(:story, project: project, requested_by: user) }

      before do
        sign_in user
        allow(subject).to receive_messages(current_user: user, current_project: project)
      end

      describe 'collection actions' do
        describe '#index' do
          it "redirects to project page when there's only one" do
            get :index
            expect(response).to redirect_to(project_url(project))
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
            expect(assigns[:project].mail_reports).to be_falsey
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
      end
    end
  end
end
