require 'rails_helper'

describe Beta::ProjectsController do
  context 'when logged out' do
    specify do
      get :show, params: { id: 42 }
      expect(response).to redirect_to(new_user_session_url)
    end
  end

  describe 'when normal user is logged in' do
    let(:normal_user)    { create :user, :with_team, email: 'normal_user@example.com' }
    let(:normal_team)    { normal_user.teams.first }
    let(:normal_project) { create :project, users: [normal_user] }

    before do
      normal_team.ownerships.create(project: normal_project, is_owner: true)
      sign_in normal_user
    end

    context 'when a normal user tries to access the beta version' do
      it 'should be redirect' do
        get :show, params: { id: normal_project.id }

        expect(response).not_to be_successful
      end
    end
  end

  context 'when admin is logged in' do
    let(:user)    { create :user, :with_team_and_is_admin, email: 'user@example.com' }
    let(:team)    { user.teams.first }
    let(:project) { create :project, users: [user] }
    let!(:story)  { create(:story, project: project, requested_by: user) }

    before do
      team.ownerships.create(project: project, is_owner: true)
      sign_in user
    end

    describe 'collection actions' do
      describe '#show' do
        describe 'tries to get an invalid project' do
          let(:invalid_project) { -1 }

          it 'should not be successful' do
            get :show, params: { id: invalid_project }

            expect(response).not_to be_successful
          end
        end

        describe 'when try get a valid project' do
          it 'should access the project' do
            get :show, params: { id: project.id }

            expect(response).to be_successful
          end
        end
      end
    end
  end
end
