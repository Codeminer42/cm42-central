require 'rails_helper'

describe StoriesController do
  describe 'when logged out' do
    specify do
      get :create, params: { project_id: "example-project" }
      expect(response).to redirect_to(new_user_session_url)
    end

    %w[update destroy].each do |action|
      specify do
        get action, params: { project_id: "example-project", id: 42 }
        expect(response).to redirect_to(new_user_session_url)
      end
    end
  end

  context 'when logged in' do
    let(:user) { create :user }
    let!(:project) do
      create(:project, name: 'Test Project', users: [user])
    end

    before do
      create_list(:story, 3, :done, project: project, requested_by: user)

      sign_in user
    end

    context 'member actions' do
      let(:story) { create(:story, project: project, requested_by: user) }
      let(:story_params) { { title: 'Foo', foo: 'Bar' } }

      let(:tasks_attributes) do
        {
          tasks_attributes: [{
            name: 'Write the tests',
            done: true
          }]
        }
      end

      let(:comments_attributes) do
        {
          comments_attributes: [
            { body: 'A little comment hihi' },
            { body: 'Another comment' }
          ]
        }
      end

      describe '#update' do
        context 'when update succeeds' do
          specify do
            get :update, params: { project_id: project.slug, id: story.id, story: story_params }
            expect(response).to redirect_to(project_path(project))
          end
        end

        context 'when update fails' do
          specify do
            get :update, params: { project_id: project.slug, id: story.id, story: { title: '' } }
            expect(response).to redirect_to(project_path(project))
          end
        end
      end

      describe '#destroy' do
        specify do
          delete :destroy, params: { project_id: project.slug, id: story.id }
          expect(response).to redirect_to(project_path(project))
        end
      end

      describe '#create' do
        context 'when save succeeds' do
          specify do
            post :create, params: { project_id: project.slug, story: story_params }
            expect(response).to redirect_to(project_path(project))
          end
        end

        xcontext 'when save fails' do
          specify do
            post :create, params: { project_id: project.slug, story: { title: '' } }
            expect(response.status).to eq(422)
            expect(response.body).to eq(assigns[:story].to_json)
          end
        end
      end
    end
  end
end
