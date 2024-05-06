require 'rails_helper'

shared_examples_for '#index' do
  context 'as html' do
    specify do
      get :index, params: { project_id: project.id }
      expect(response).to be_successful
      expect(assigns[:project]).to eq(project)
    end
  end

  context 'as json' do
    specify do
      get :index, xhr: true, params: { project_id: project.id, format: :json }
      expect(response).to be_successful
      expect(response.body).to eq(project.users.to_json)
    end
  end
end

describe UsersController do
  let(:project) { create(:project) }

  context 'when logged out' do
    specify do
      get :index, params: { project_id: project.id }
      expect(response).to redirect_to(new_user_session_url)
    end

    specify do
      post :create, params: { project_id: project.id }
      expect(response).to redirect_to(new_user_session_url)
    end

    specify do
      delete :destroy, params: { id: 42, project_id: project.id }
      expect(response).to redirect_to(new_user_session_url)
    end
  end

  let(:another_user) { create :user }

  context 'when logged in as admin' do
    let(:user) { create(:user, :admin) }

    before do
      create(:membership, user: user, project: project)
      create(:membership, user: another_user, project: project)
      sign_in user
      allow(subject).to receive_messages(current_user: user, current_project: project)
    end

    describe 'collection actions' do
      it_should_behave_like '#index'

      describe '#create' do
        let(:invalid_params) do
          {
            name: 'name',
            username: 'foo.bar'
          }
        end

        let(:valid_params) do
          {
            email: 'foo@bar.com',
            name: 'name',
            initials: 'fb',
            username: 'foo.bar'
          }
        end

        before { request.env['HTTP_REFERER'] = root_url }

        context 'when there are valid params' do
          let(:created_user) { User.find_by(email: 'foo@bar.com') }

          before do
            post :create, params: { project_id: project.id, user: valid_params }
          end

          it 'displays a successful message' do
            expect(flash.notice).to eq 'foo@bar.com was added to the project'
          end

          it 'enrolls the created user to the current project' do
            expect(created_user.projects).to include project
          end
        end

        context 'when there are invalid params' do
          it 'displays a message that the user was not created' do
            post :create, params: {  project_id: project.id, user: invalid_params }

            expect(flash[:alert]).to eq 'User was not created'
          end
        end
      end
    end

    describe 'member actions' do
      describe '#destroy' do
        before { request.env['HTTP_REFERER'] = root_url }

        context 'himself' do
          specify do
            delete :destroy, params: { project_id: project.id, id: user.id }
            expect(response).to redirect_to(root_url)
          end
        end

        context 'another user' do
          specify do
            delete :destroy, params: { project_id: project.id, id: another_user.id }
            expect(response).to redirect_to(root_url)
          end

          context 'user has accepted stories attached' do
            let!(:story) { create(:story, :done, project: project, owned_by: another_user, requested_by: user) }

            it 'deletes user membership' do
              expect {
                delete :destroy, params: { project_id: project.id, id: another_user.id }
              }.to change{ project.users.reload.include? another_user }.from(true).to(false)
            end
          end
        end
      end
    end
  end

  context 'when logged in as non-admin user' do
    let(:user)  { create(:user, email: 'foobar@example.com') }

    before do
      create(:membership, user: user, project: project)
      create(:membership, user: another_user, project: project)
      sign_in user
      allow(subject).to receive_messages(current_user: user, current_project: project)
    end

    describe 'collection actions' do
      it_should_behave_like '#index'

      describe '#create' do
        let(:user_params) do
          {
            'email' => 'user@example.com',
            'name'      => 'Test User',
            'initials'  => 'TU',
            'username'  => 'test_user'
          }
        end

        specify do
          post :create, params: { project_id: project.id, user: user_params }
          expect(flash[:error]).to eq(I18n.t('users.You are not authorized to perform this action'))
          expect(response).to redirect_to(root_path)
        end

        context 'when user exists' do
          before do
            create(:user, user_params)
          end

          specify do
            post :create, params: { project_id: project.id, user: user_params }
            expect(flash[:error])
              .to eq(I18n.t('users.You are not authorized to perform this action'))
            expect(response).to redirect_to(root_path)
          end
        end
      end
    end

    describe 'member actions' do
      describe '#destroy' do
        context 'himself' do
          before do
            request.env['HTTP_REFERER'] = root_url
            delete :destroy, params: { project_id: project.id, id: user.id }
          end

          it { expect(response).to redirect_to(root_url) }
          it { expect(flash[:notice]).to eq('foobar@example.com was removed from this project') }
        end

        context 'another user' do
          specify do
            delete :destroy, params: { project_id: project.id, id: another_user.id }
            expect(flash[:error])
              .to eq(I18n.t('users.You are not authorized to perform this action'))
            expect(response).to redirect_to(root_path)
          end
        end
      end
    end
  end
end
