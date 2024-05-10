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
        describe '#show' do
          context 'as html' do
            specify do
              get :show, params: {id: project.id }
              expect(response).to be_successful
              expect(assigns[:project]).to eq(project)
              expect(assigns[:new_todo_story]).to be_new_record
              expect(assigns[:new_todo_story].project).to eq(project)
              expect(assigns[:new_todo_story]).to be_unstarted
              expect(assigns[:new_icebox_story]).to be_new_record
              expect(assigns[:new_icebox_story].project).to eq(project)
              expect(assigns[:new_icebox_story]).to be_unscheduled
            end
          end

          context 'as json' do
            specify do
              get :show, xhr: true, params: { id: project.id }
              expect(response).to be_successful
              expect(assigns[:project]).to eq(project)
              expect(assigns[:new_todo_story]).to be_new_record
              expect(assigns[:new_todo_story].project).to eq(project)
              expect(assigns[:new_todo_story]).to be_unstarted
              expect(assigns[:new_icebox_story]).to be_new_record
              expect(assigns[:new_icebox_story].project).to eq(project)
              expect(assigns[:new_icebox_story]).to be_unscheduled
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
      end
    end
  end
end
