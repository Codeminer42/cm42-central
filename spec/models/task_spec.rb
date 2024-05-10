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
end
