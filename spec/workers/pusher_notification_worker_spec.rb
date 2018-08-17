require 'rails_helper'

describe PusherNotificationWorker do
  let(:channel_name) { "project-board-1" }

  it "notifies the pusher that the board has changes" do
    expect(Pusher).to receive(:trigger).with(
      channel_name,
      'notify_changes',
      message: I18n.t('update_stories_successfully')
    )

    subject.perform(channel_name)
  end
end
