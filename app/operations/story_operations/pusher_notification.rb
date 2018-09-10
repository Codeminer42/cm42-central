module StoryOperations
  module PusherNotification
    def notify_changes
      ::PusherNotificationWorker.perform_async(channel_name)
    end

    private

    def channel_name
      "project-board-#{model.project_id}"
    end
  end
end
