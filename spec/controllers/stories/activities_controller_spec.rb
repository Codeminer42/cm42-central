require 'rails_helper'

describe Stories::ActivitiesController do
  let(:user)  { create(:user, :with_team) }
  let(:story) { create(:story, :with_project, requested_by: user) }

  context "when logged out" do
    specify do
      get :index, project_id: story.project.id, story_id: story.id
      expect(response).to redirect_to(new_user_session_url)
    end
  end

  context "when logged in" do
    before do
      sign_in user
      allow(subject).to receive_messages(current_user: user, current_team: user.teams.first)
    end

    describe "#index" do
      before do
        xhr :get, :index, project_id: story.project.id, story_id: story.id
      end

      it "returns a successful response" do
        expect(response).to be_success
      end

      it "returns all the activities from a Story" do
        expect(response.body).to eq(assigns[:activities].to_json)
      end
    end
  end
end
