require 'rails_helper'

describe StoriesBulkDestroyController do
  describe "#create" do
    context "when receive an array of story ids" do
      it "destroys stories" do
        user = create(:user, :with_team)
        project = create(:project, users: [user], teams: [user.teams.first])
        story_1 = create(:story, project: project, requested_by: user)
        story_2 = create(:story, project: project, requested_by: user)
        story_3 = create(:story, project: project, requested_by: user)

        sign_in user

        post :create, project_id: project.id, story_ids: [story_1.id, story_2.id]

        expect(project.stories).to eq([story_3])
      end
    end
  end
end
