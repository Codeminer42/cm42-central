module StoryOperations 
  class UserNotification
    def self.notify_users(story)
      new(story).notify_users
    end

    def initialize(story)
      @story = story
    end

    def notify_users
      return if !notify_mentioned_users?
      Notifications.story_mention(story, users_to_notify.pluck(:email)).deliver_later
    end

    private

    attr_reader :story

    def users_to_notify
      usernames = UsernameParser.parse(story.description)
      
      return [] if usernames.empty?

      story.users.where(username: usernames).all
    end

    def notify_mentioned_users?
      story.description.present? && users_to_notify.any? && !story.suppress_notifications
    end
  end
end
