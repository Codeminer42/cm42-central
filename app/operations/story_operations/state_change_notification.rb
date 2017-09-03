module StoryOperations
  module StateChangeNotification
    def notify_state_changed
      return unless can_notify_state_changed?

      Notifications.story_changed(model, model.acting_user).deliver_later
      IntegrationWorker.perform_async(model.project.id, integration_message)
    end

    def can_notify_state_changed?
      StoryChangesNotificationsChecker.new(model).can_notify?
    end

    def integration_message
      {
        discord: DiscordMessage.new(model).message,
        slack: SlackMessage.new(model).message,
        mattermost: mattermost
      }
    end

    def mattermost
      story = "['#{model.title}'](#{"#{model.base_uri}#story-#{model.id}"})"
      "[#{model.project.name}] The story #{story} has been #{model.state}."
    end
  end
end
