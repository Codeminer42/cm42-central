require 'rails_helper'

describe StoryOperations::UpdateAll do
  let(:user_1)    { create(:user, :with_team) }
  let(:user_2)    { create(:user, :with_team) }
  let(:user_3)    { create(:user, :with_team) }
  let(:project_1) { create(:project, users: [user_1, user_2], teams: [user_1.teams.first]) }
  let(:project_2) { create(:project, users: [user_3], teams: [user_3.teams.first]) }
  let(:story_1)   { create(:story, project: project_1, requested_by: user_1) }
  let(:story_2)   { create(:story, project: project_1, requested_by: user_2) }
  let(:story_3)   { create(:story, project: project_2, requested_by: user_3) }

  subject { StoryOperations::UpdateAll.new }

  let(:result) do
    stories = [story_1, story_2, story_3]
    params = { labels: 'backend', requested_by_id: user_2.id, owned_by_id: user_1.id }
    subject.call(stories: stories, data: params, current_user: user_1)
  end

  context 'when the user is not of the same project' do
    it 'does not update any story' do
      expect(result.success?).to be_falsy
    end
  end
end
