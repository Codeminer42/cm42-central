require 'rails_helper'

describe Stories::ActivitiesController do
  let(:user)  { create(:user) }
  let(:story) { create(:story, :with_project, :with_activity, requested_by: user) }

  context 'when logged out' do
    specify do
      get :index, params: { project_id: story.project.id, story_id: story.id }
      expect(response).to redirect_to(new_user_session_url)
    end
  end

  context 'when logged in' do
    before do
      sign_in user

      allow(subject).to receive_messages(current_user: user, current_project: user.projects.first)
    end

    describe '#index' do
      before do
        get :index, xhr: true, params: { project_id: story.project.slug, story_id: story.id }
      end

      it 'returns a successful response' do
        expect(response).to be_successful
      end

      it 'returns all the activities from a Story' do
        expect(response.body).to eq(assigns[:activities].to_json)
      end

      it 'assigns activities variable' do
        expect(assigns[:activities]).to match_array(Activity.where(subject: story))
      end

      it 'assigns project variable' do
        expect(assigns[:project]).to eq(story.project)
      end

      it 'assigns story variable' do
        expect(assigns[:story]).to eq(story)
      end
    end
  end
end
