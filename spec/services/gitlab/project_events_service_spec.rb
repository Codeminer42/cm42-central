require 'rails_helper'

describe Gitlab::ProjectEventsService do
  describe '#perform' do
    subject { service.perform }

    let(:service) { described_class.new(params) }
    let(:story) { FactoryBot.create(:story, :with_project) }
    let(:story_operations_update_instance) { StoryOperations::Update.new }

    before do
      allow(Story).to receive(:find_by).with(branch: 'test-branch').and_return(story)
      allow(StoryOperations::Update).to receive(:new).and_return(story_operations_update_instance)
      allow(story_operations_update_instance).to receive(:call).with(
        story: story,
        data: { state: 'delivered' },
        current_user: story.requested_by
      ).and_return(true)
    end

    context 'when merged' do
      let(:params) {
        {
          'object_attributes' => {
            'action' => 'merge',
            'source_branch' => 'test-branch'
          },
          'object_kind' => 'merge_request'
        }
      }
      it { is_expected.to eq(true) }
    end

    context 'when not merged' do
      let(:params) {
        {
          'object_attributes' => {
            'action' => 'update',
            'source_branch' => 'test-branch'
          },
          'object_kind' => 'other'
        }
      }
      it { is_expected.to eq(nil) }
    end
  end
end
