require 'rails_helper'

describe TeamsController, type: :controller do
  let(:user) { create :user, :with_team_and_is_admin }
  let!(:team) { user.teams.first }

  context 'when logged out' do
    %w(index switch new).each do |action|
      specify do
        get action
        expect(response).to redirect_to(new_user_session_url)
      end
    end

    %w(edit update destroy).each do |action|
      specify do
        get action, id: 42
        expect(response).to redirect_to(new_user_session_url)
      end
    end

    describe '#create' do
      let(:team_params) { { 'name' => 'Test Team' } }

      before { sign_in user }

      specify do
        post :create, team: team_params
        expect(assigns[:team].name).to eq(team_params['name'])
      end

      context 'when save succeeds' do
        specify do
          post :create, team: team_params
          expect(response).to redirect_to(root_path)
          expect(flash[:notice]).to eq(I18n.t('teams.team was successfully created'))
        end
      end

      context 'when save fails' do
        specify do
          post :create, team: { name: nil }
          expect(response).to be_success
          expect(response).to render_template('new')
        end
      end
    end
  end

  context 'when logged in' do
    context 'as admin' do
      before do
        sign_in user
        allow(subject).to receive_messages(current_user: user, current_team: user.teams.first)
      end

      describe '#switch' do
        it 'must set the current_team_slug session' do
          get :switch, team_slug: team.slug
          expect(session[:current_team_slug]).to eq(team.slug)
        end
      end

      describe '#manage_users' do
        before { create_list :user, 2, teams: [team] }

        it 'only list users this team to manage' do
          get :manage_users, team_id: team.slug
          expect(response).to be_success
          expect(assigns[:users].count).to eq(3)
        end
      end

      describe '#create_enrollment' do
        before { sign_in user }
        context 'with valid parameters' do
          let(:values) { { email: 'sample@example.com' } }

          context 'when the user is not in the current team' do
            let!(:normal_user_without_team) { create :user, email: 'sample@example.com' }
            it 'should return successfully associate in current team' do
              post :create_enrollment, team_id: team.slug, user: values

              expect(response).to redirect_to(team_new_enrollment_path)
              expect(flash[:notice]).to eq(I18n.t('teams.team_was_successfully_updated'))
            end
          end

          context 'when the user is in the current team' do
            let(:normal_user_with_team) { create :user, teams: [team], email: 'sample@example.com' }
            it 'should return that user is already in this team ' do
              post :create_enrollment, team_id: normal_user_with_team.teams.first.slug, user: values

              expect(response).to redirect_to(team_new_enrollment_path)
              expect(flash[:notice]).to eq(I18n.t('teams.user_is_already_in_this_team'))
            end
          end

          context 'when the user does not exist' do
            it 'should not find a user to associate' do
              post :create_enrollment, team_id: team.slug, user: values

              expect(response).to redirect_to(team_new_enrollment_path)
              expect(flash[:notice]).to eq(I18n.t('teams.user_not_found'))
            end
          end
        end
      end

      describe '#edit' do
        specify do
          get :edit, id: 'xyz'
          expect(response).to be_success
          expect(assigns[:team]).to eq(team)
        end
      end

      describe '#update' do
        let(:team_params) { { name: 'New Team Name' } }

        specify do
          put :update, id: 'xyz', team: team_params
          expect(assigns[:team].name).to eq('New Team Name')
        end

        context 'when update succeeds' do
          specify do
            put :update, id: 'xyz', team: team_params
            expect(response).to be_success
            expect(response).to render_template('edit')
          end
        end

        context 'when update fails' do
          before { create :team, name: 'Team Hello' }
          specify do
            put :update, id: 'xyz', team: { name: 'Team Hello' }
            expect(response).to be_success
            expect(response).to render_template('edit')
          end

          context 'when name is empty' do
            specify do
              put :update, id: 'xyz', team: { name: '' }
              expect(response).to be_success
              expect(response).to render_template('edit')
            end
          end
        end
      end

      describe '#destroy' do
        specify do
          delete :destroy, id: 'xyz'
          expect(assigns[:team].archived_at).to_not be_nil
          expect(session[:current_team_slug]).to be_nil
          expect(response).to redirect_to(root_path)
        end
      end
    end

    context 'as normal user' do
      let(:normal_user) { create :user, teams: [team] }

      before do
        sign_in normal_user
        allow(subject)
          .to receive_messages(current_user: normal_user, current_team: normal_user.teams.first)
      end

      describe '#edit' do
        specify do
          get :edit, id: 'xyz'
          expect(response).to_not be_success
          expect(response).to redirect_to(root_path)
        end
      end

      describe '#update' do
        specify do
          put :update, id: 'xyz', team: { name: 'New Team Test' }
          expect(response).to_not be_success
          expect(response).to redirect_to(root_path)
        end
      end

      describe '#destroy' do
        specify do
          delete :destroy, id: 'xyz'
          expect(response).to_not be_success
          expect(response).to redirect_to(root_path)
        end
      end
    end
  end
end
