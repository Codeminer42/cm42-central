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
    end

    private

    attr_reader :story

    def can_notify_state_changed?
      StoryChangesNotificationsChecker.new(story).can_notify?
    end
  end
end
