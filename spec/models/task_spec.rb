require 'rails_helper'

describe Task do
  let(:project) { mock_model(Project, suppress_notifications: true) }
  let(:story)   { mock_model(Story, project: project) }

  subject(:task) { build :task, story: story }

  describe 'associations' do
    it { expect(task).to belong_to(:story) }
  end

  describe 'validations' do
    it { expect(task).to validate_presence_of(:name) }
  end

  describe '#as_json' do
    it 'returns the right keys' do
      expect(task.as_json.keys.sort).to eq(%w[
                                                     created_at done id name story_id updated_at
                                                   ])
    end
  end

  describe '#to_csv' do
    context 'task completed' do
      let(:task) { build :task, story: story, name: 'task_test', done: true }
      subject { task.to_csv }

      it { is_expected.to contain_exactly(task.name, 'completed') }
    end

    context 'task not completed' do
      let(:task) { build :task, story: story, name: 'task_test', done: false }
      subject { task.to_csv }

      it { is_expected.to contain_exactly(task.name, 'not_completed') }
    end
  end
end
