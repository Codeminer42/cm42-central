require 'rails_helper'

describe Admin::UsersController do
  context 'when logged out' do
    %w[index].each do |action|
      specify do
        get action
        expect(response).to redirect_to(new_user_session_url)
      end
    end
    %w[edit update destroy].each do |action|
      specify do
        get action, params: { id: 42 }
        expect(response).to redirect_to(new_user_session_url)
      end
    end
  end

  context 'when logged in as admin' do
    let(:user) { create :user, :admin }
    let(:project) { create :project }

    before do
      project.users << user
      sign_in user
      allow(subject).to receive_messages(current_user: user, current_project: user.projects.first)
    end

    describe 'collection actions' do
      describe '#index' do
        specify do
          get :index
          expect(response).to be_successful
          expect(assigns[:users]).to eq([user])
        end
      end
    end

    describe 'member actions' do
      describe '#edit' do
        specify do
          get :edit, params: { id: user.id }
          expect(response).to be_successful
          expect(assigns[:user]).to eq(user)
        end
      end

      describe '#update' do
        before do
          allow(user).to receive(:update).with({}) { true }
        end

        specify do
          put :update, params: { id: user.id, user: {} }
          expect(assigns[:user]).to eq(user)
        end

        context 'when update succeeds' do
          specify do
            put :update, params: { id: user.id, user: {} }
            expect(response).to redirect_to(admin_users_path)
          end
        end

        context 'when update fails' do
          before do
            allow(user).to receive(:update).with({}) { false }
          end

          specify do
            put :update, params: { id: user.id, user: {} }
            expect(response).to redirect_to(admin_users_path)
          end
        end
      end

      describe '#destroy' do
        specify do
          expect { delete :destroy, params: { id: user.id } }.to change { Membership.count }.by(-1)
          expect(response).to redirect_to(admin_users_path)
        end
      end
    end
  end

  context 'when logged in as non-admin user' do
    let(:user)         { create :user }

    before do
      sign_in user
      allow(subject).to receive_messages(current_user: user, current_project: user.projects.first)
    end

    describe 'collection actions' do
      describe '#index' do
        specify do
          get :index
          expect(response).to be_successful
          expect(assigns[:users]).to eq([])
        end
      end

      describe 'member actions' do
        describe '#edit' do
          specify do
            get :edit, params: { id: user.id }
            expect(response).to redirect_to(root_path)
            expect(flash[:alert]).to eq(I18n.t('not_found'))
          end
        end

        describe '#update' do
          specify do
            put :update, params: { id: user.id, user: {} }
            expect(response).to redirect_to(root_path)
            expect(flash[:alert]).to eq(I18n.t('not_found'))
          end
        end

        describe '#destroy' do
          specify do
            delete :destroy, params: { id: user.id }
            expect(response).to redirect_to(root_path)
            expect(flash[:alert]).to eq(I18n.t('not_found'))
          end
        end
      end
    end
  end
end
