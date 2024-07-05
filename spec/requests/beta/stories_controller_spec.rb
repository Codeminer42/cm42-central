require 'rails_helper'

RSpec.describe 'Ordering stories', type: :request do
  let(:user) { create :user, :with_team }
  let(:project) do
    create(:project, name: 'Test Project', users: [user], teams: [user.teams.first])
  end

  context 'when moving story in the same state' do
    let!(:bug) { create(:story, :active, project: project, requested_by: user, new_position: 1) }
    let!(:chore) { create(:story, :active, project: project, requested_by: user, new_position: 2) }
    let!(:feature) { create(:story, :active, project: project, requested_by: user, new_position: 3) }

    before do
      sign_in user
      post position_beta_story_path(id: chore.id), params: { story: { position: 4, new_position: 4, id: chore.id, state: 'started', project_id: project.id }, id: chore.id }
    end

    it 'moves story to correct position' do
      chore_new_position = chore.reload.new_position
      bug_new_position = bug.reload.new_position
      feature_new_position = feature.reload.new_position
      expect(chore_new_position).to eq(4)
      expect(bug_new_position).to eq(1)
      expect(feature_new_position).to eq(3)
    end
  end

  context 'when moving story in different state' do
    let!(:bug) { create(:story, state: 'unscheduled', project: project, requested_by: user, new_position: 1) }
    let!(:chore) { create(:story, :active, project: project, requested_by: user, new_position: 1) }
    let!(:feature) { create(:story, :active, project: project, requested_by: user, new_position: 2) }

    before do
      sign_in user
      post position_beta_story_path(id: bug.id), params: { story: { position: 0, new_position: 1, id: bug.id, state: 'started', project_id: project.id } }
    end

    it 'moves story to correct position' do
      chore_new_position = chore.reload.new_position
      bug_new_position = bug.reload.new_position
      feature_new_position = feature.reload.new_position
      expect(chore_new_position).to eq(2)
      expect(bug_new_position).to eq(1)
      expect(feature_new_position).to eq(3)
    end
  end
end
