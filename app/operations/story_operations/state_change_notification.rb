module StoryOperations
  class StateChangeNotification
    def self.notify_state_changed(story)
      new(story).notify_state_changed
    end

    def initialize(story)
      @story = story
    end

    def notify_state_changed
      return unless can_notify_state_changed?

      Notifications.story_changed(story, story.acting_user).deliver_later
      IntegrationWorker.perform_async(story.project.id, integration_message)
    end

    private

    attr_reader :story

    def can_notify_state_changed?
      StoryChangesNotificationsChecker.new(story).can_notify?
    end

    def integration_message
      {
        discord: DiscordMessage.new(story).message,
        slack: SlackMessage.new(story).message,
        mattermost: mattermost
      }
    end

    def mattermost
      story_string = "['#{story.title}'](#{"#{story.base_uri}#story-#{story.id}"})"
      "[#{story.project.name}] The story #{story_string} has been #{story.state}."
    end
  end
end
