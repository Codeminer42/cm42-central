require 'rails_helper'

describe MembershipsController do
  let(:user)       { create(:user, :with_team_and_is_admin) }
  let(:project)    { create(:project) }
  let!(:ownership) { create(:ownership, team: user.teams.first, project: project) }

  before do
    sign_in user
    allow(subject).to receive_messages(current_user: user, current_team: user.teams.first)
  end

  describe 'POST #create' do
    let(:user_params) { { email: 'foo@bar.com' } }

    it 'redirects to the project members url path' do
      post :create, project_id: project.id, user: user_params

      expect(response).to redirect_to(project_users_url(project))
    end

    context 'when the user exists' do
      let!(:new_member) { create(:user, user_params) }

      context 'but its already enrolled to the project' do
        it 'displays a message that the user is already enrolled to the project' do
          project.users << new_member
          post :create, project_id: project.id, user: user_params

          expect(flash[:alert]).to eq 'foo@bar.com is already a member of this project'
        end
      end

      context 'and the user is not enrolled to the project yet' do
        it 'displays a message that the user was added to the project' do
          post :create, project_id: project.id, user: user_params

          expect(flash[:notice]).to eq('foo@bar.com was added to this project')
        end

        it 'enrolls the user to the project' do
          post :create, project_id: project.id, user: user_params

          expect(project.users).to include(new_member)
        end
      end
    end

    context 'when the user does not exist' do
      it 'displays that the user is not found' do
        post :create, project_id: project.id, user: user_params

        expect(flash[:alert]).to eq(I18n.t('teams.user_not_found'))
      end
    end
  end
end
