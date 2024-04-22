module StoryOperations
  class Create
    include Operation

    def initialize(story:, current_user:)
      @story = story
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield save_story
        yield create_changesets
        yield create_activity

        yield notify_users
        yield notify_changes

        Success(story)
      end
    end

    private

    attr_reader :story, :current_user

    def save_story
      if story.save
        Success(story)
      else
        Failure(story)
      end
    end

    def create_changesets
      story.changesets.create
      Success(story)
    end

    def notify_users
      Success Notifications.new_story(story, current_user)&.deliver_later
    end

    def notify_changes
      Success StoryOperations::PusherNotification.notify_changes(story)
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        story,
        current_user: current_user,
        action: 'create'
      )
    end
  end
end
