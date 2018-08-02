require 'rails_helper'

describe Beta::ProjectBoardOperations do
  describe 'Read' do
    context 'when the project exists' do
      let(:project) do
        create(:project, :with_past_iteration, users: [user], teams: [user.teams.first])
      end
      let(:user) { create(:user, :with_team) }

      before do
        allow(StoryOperations::ReadAll)
          .to receive(:call).with(project: project)
          .and_return(
            active_stories: 'Active Stories',
            past_iterations: 'Past Iterations'
          )
      end

      it 'returns all the project board data' do
        result = Beta::ProjectBoardOperations::Read.call(project.id, user)

        expect(result).to be_success

        expect(result.data.project).to eq project
        expect(result.data.users).to match [user]
        expect(result.data.current_user).to eq user
        expect(result.data.current_flow).to be_nil
        expect(result.data.default_flow).to eq Fulcrum::Application.config.fulcrum.column_order
        expect(result.data.stories).to eq 'Active Stories'
        expect(result.data.past_iterations).to eq 'Past Iterations'
      end
    end

    context 'when the project does not exist' do
      it 'returns a failed response with the error' do
        result = Beta::ProjectBoardOperations::Read.call(0, nil)

        expect(result).not_to be_success
        expect(result.error).to be_a ActiveRecord::RecordNotFound
      end
    end
  end
end
