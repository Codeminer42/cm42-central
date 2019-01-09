require 'rails_helper'

describe RemoveStoriesFromUserService do
  describe '.call' do
    let(:user) { build_stubbed(:user) }
    let(:project) { build_stubbed(:project) }

    context 'When story.requested_by_id equals to the user id' do
      let(:story) { instance_spy(Story, requested_by_id: user.id) }

      before { allow(project).to receive(:stories).and_return([story]) }

      it 'unassociate the stories that user requests' do
        described_class.call(user, project)

        expect(story).to have_received(:update!).with(requested_by_id: nil, requested_by_name: nil)
      end
    end

    context 'When story.owned_by_id equals to the user id' do
      let(:story) { instance_spy(Story, owned_by_id: user.id) }

      before { allow(project).to receive(:stories).and_return([story]) }

      it 'unassociate the stories that user owned' do
        described_class.call(user, project)

        expect(story).to have_received(:update!).with(owned_by_id: nil, owned_by_name: nil)
      end
    end
  end
end
