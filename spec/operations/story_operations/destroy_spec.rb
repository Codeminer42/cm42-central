require 'rails_helper'

describe StoryOperations::Destroy do
  let(:story_params) do
    { title: 'Test Story', requested_by: user, state: 'unstarted', accepted_at: nil }
  end

  let!(:membership) { create(:membership) }
  let(:user)        { membership.user }
  let(:project)     { membership.project }
  let(:story)       { project.stories.build(story_params) }

  before { story.save! }

  context '::PusherNotification' do
    it 'notifies the pusher that the board has changes' do
      expect(PusherNotificationWorker).to receive(:perform_async)

      StoryOperations::Destroy.new.call(story: story, current_user: user)
    end
  end
end
