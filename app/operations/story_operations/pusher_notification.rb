module StoryOperations
  class PusherNotification
    def self.notify_changes(story)
      new(story).notify_changes
    end

    def initialize(story)
      @story = story
    end

    def notify_changes
      ::PusherNotificationWorker.perform_async(channel_name)
    end

    private

    attr_reader :story

    def channel_name
      "project-board-#{story.project_id}"
    end
  end
end
