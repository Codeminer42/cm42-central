require 'rails_helper'

describe RemoveStoriesFromUserService do
  describe '.call' do
    let(:user) { create :user }

    let(:project) do
      create :project, users: [user]
    end

    context 'When story.requested_by_id equals to the user id' do
      let(:story) do
        create(:story, requested_by_id: user.id, project: project)
      end

      before do
        project.stories << story
      end

      it 'unassociate the stories that user requests' do
        described_class.call(user, project)
        story.reload

        expect(story.requested_by_id).to be nil
      end
    end

    context 'When story.owned_by_id equals to the user id' do
      let(:story) do
        create(:story,
          owned_by_id: user.id,
          requested_by_id: user.id,
          project: project)
      end

      before do
        project.stories << story
      end

      it 'unassociate the stories that user owned' do
        described_class.call(user, project)
        story.reload

        expect(story.owned_by_id).to be nil
      end
    end
  end
end
