require 'rails_helper'

describe StoryOperations::PusherNotification do
  class PusherClass
    include StoryOperations::PusherNotification
    attr_reader :user, :model

    def initialize(model, user)
      @model = model
      @user = user
    end
  end

  let(:story_params) do
    { title: 'Test Story', requested_by: user, state: 'unstarted', accepted_at: nil }
  end

  let(:user)        { create(:user) }
  let(:project)     { create(:project) }
  let(:model)       { project.stories.build(story_params) }
  let(:channel_name) { "project-board-#{project.id}" }

  describe '#notify_changes' do
    subject { PusherClass.new(model, user) }

    it "notifies the pusher that the board has changes" do
      expect(PusherNotificationWorker).to receive(:perform_async).with(
        channel_name
      )

      subject.notify_changes
    end

  end
end
