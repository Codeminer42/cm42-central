require 'rails_helper'

xdescribe IntegrationsController do
  let(:user)        { create(:user, :with_team_and_is_admin) }
  let(:project)     { create(:project, users: [user], teams: [user.teams.first]) }

  let(:integration) { build(:integration, project: project) }

  context 'when logged out' do
    %w[index create].each do |action|
      specify do
        get action, params: { project_id: project.id }
        expect(response).to redirect_to(new_user_session_url)
      end
    end
    %w[destroy].each do |action|
      specify do
        get action, params: { id: 42, project_id: project.id }
        expect(response).to redirect_to(new_user_session_url)
      end
    end
  end

  context 'when logged in' do
    before do
      sign_in user
      allow(subject).to receive_messages(current_user: user, current_team: user.teams.first)
    end

    describe 'collection actions' do
      describe '#index' do
        context 'as html with saved integrations' do
          before { integration.save }

          specify do
            get :index, params: { project_id: project.id }
            expect(response).to be_successful
            expect(assigns[:project]).to eq(project)
            expect(assigns[:integrations][0]).to eq(integration)
          end
        end

        context 'as html with no integrations' do
          specify do
            get :index, params: { project_id: project.id }
            expect(response).to be_successful
            expect(assigns[:project]).to eq(project)
            expect(assigns[:integrations].count).to eq(4)
            expect(assigns[:integrations].first.kind).to eq('discord')
          end
        end

        context 'as json' do
          before { integration.save }

          specify do
            get :index, xhr: true, params: { project_id: project.id, format: :json}
            expect(response).to be_successful
            expect(JSON.parse(response.body).first['integration']['data']).to eql(integration.data)
          end
        end
      end

      describe '#create' do
        let(:integration_params) do
          {
            'kind' => integration.kind,
            'data' => integration.data
          }
        end

        specify do
          expect do
            post :create, params: { project_id: project.id, integration: integration_params }
          end.to change { Integration.count }.by(1)

          expect(assigns[:project]).to eq(project)
          expect(assigns[:integration].kind).to eq(integration_params['kind'])
          expect(assigns[:integration].data).to eq(integration_params['data'])
          expect(response).to redirect_to(project_integrations_url(project))
        end

        context 'when integration does not exist' do
          context 'when save succeeds' do
            specify do
              post :create, params: { project_id: project.id, integration: integration_params }
              expect(flash[:notice]).to eq("#{integration.kind} was added to this project")
            end
          end
        end

        context 'when integration exists' do
          before { integration.save }

          specify do
            expect do
              post :create, params: { project_id: project.id, integration: integration_params }
            end.to change { Integration.count }.by(0)
            expect(flash[:alert])
              .to eq("#{integration.kind} is already configured for this project")
          end
        end
      end
    end

    describe 'integration actions' do
      before { integration.save }

      describe '#destroy' do
        specify do
          delete :destroy, params: { project_id: project.id, id: integration.id }
          expect(response).to redirect_to(project_integrations_url(project))
        end
      end
    end
  end
end
