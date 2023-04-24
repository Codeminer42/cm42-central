require 'rails_helper'

describe Beta::ProjectBoardOperations do
  describe 'Read' do
    context 'when the project exists' do
      let(:project) do
        create(:project, :with_past_iteration, users: [user], teams: [user.teams.first])
      end

      let(:stories) do
        create_list(:story, 5, labels: '', project: project, requested_by: user)
      end

      let(:user) { create(:user, :with_team) }

      let(:story_operations_read_all_instance) { instance_double(StoryOperations::ReadAll, call: { active_stories: stories, past_iterations: 'Past Iterations' }) }

      before do
        allow(StoryOperations::ReadAll).to receive(:new).and_return(story_operations_read_all_instance)
      end

      it 'returns all the project board data' do
        result = Beta::ProjectBoardOperations::Read.call(project.id, user)

        expect(result).to be_successful

        expect(result.data.project).to eq project
        expect(result.data.users).to match [user]
        expect(result.data.current_user).to eq user
        expect(result.data.current_flow).to be_nil
        expect(result.data.default_flow).to eq Fulcrum::Application.config.fulcrum.column_order
        expect(result.data.stories).to eq stories
        expect(result.data.past_iterations).to eq 'Past Iterations'
        expect(result.data.labels).to eq ''
      end

      describe 'project_labels' do
        before do
          stories[0].update! labels: 'front,back'
          stories[1].update! labels: 'front'
          stories[2].update! labels: 'bug,back'
        end

        let(:expected_labels) { 'front,back,bug' }

        it 'return a string with uniq labels' do
          result = Beta::ProjectBoardOperations::Read.call(project.id, user)

          expect(result.data.labels).to eq expected_labels
        end
      end
    end

    describe 'when the project does not exist' do
      let(:user)    { create :user }
      let(:project) { create :project, users: [user] }
      let(:result)  { Beta::ProjectBoardOperations::Read.call(nil, user) }

      it { expect(result).not_to be_successful }
      it { expect(result.error).to be_a ActiveRecord::RecordNotFound }
    end
  end
end
