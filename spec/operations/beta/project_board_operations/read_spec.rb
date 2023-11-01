require 'rails_helper'

describe Beta::ProjectBoardOperations::Read do
  describe '#call' do
    subject { -> { Beta::ProjectBoardOperations::Read.call(project_id: project.id, current_user: user) }}

    let(:project) do
      create(:project, :with_past_iteration, users: [user], teams: [user.teams.first])
    end

    let(:stories) do
      create_list(:story, 5, labels: '', project: project, requested_by: user)
    end

    let(:user) { create(:user, :with_team) }

    context 'when the project exists' do
      let(:story_operations_read_all_instance) { instance_double(StoryOperations::ReadAll, call: Dry::Monads::Success({ active_stories: stories })) }

      before do
        allow(StoryOperations::ReadAll).to receive(:new).and_return(story_operations_read_all_instance)
        allow_any_instance_of(Iterations::ProjectIterations).to receive(:past_iterations).and_return("Past Iterations")
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end

      it 'returns with project' do
        expect(subject.call.success.project).to eq(project)
      end

      it 'returns with users' do
        expect(subject.call.success.users).to eq([user])
      end

      it 'returns with current_user' do
        expect(subject.call.success.current_user).to eq(user)
      end

      it 'returns without current_flow' do
        expect(subject.call.success.current_flow).to be_nil
      end

      it 'returns with default_flow' do
        expect(subject.call.success.default_flow).to eq(Fulcrum::Application.config.fulcrum.column_order)
      end

      it 'returns with stories' do
        expect(subject.call.success.stories).to match_array(stories)
      end

      it 'returns with past_iterations' do
        expect(subject.call.success.past_iterations).to eq('Past Iterations')
      end

      it 'returns with empty labels' do
        expect(subject.call.success.labels).to eq('')
      end

      describe 'project_labels' do
        before do
          stories[0].update! labels: 'front,back'
          stories[1].update! labels: 'front'
          stories[2].update! labels: 'bug,back'
        end

        let(:expected_labels) { 'front,back,bug' }

        it 'return a string with uniq labels' do
          expect(subject.call.success.labels).to eq expected_labels
        end
      end
    end

    describe 'when the project does not exist' do
      let(:project) { build(:project) }

      it 'returns failure' do
        expect(subject.call.failure?).to be(true)
      end

      it 'returns error ActiveRecord::RecordNotFound' do
        expect(subject.call.failure).to be_a(ActiveRecord::RecordNotFound)
      end
    end
  end
end
