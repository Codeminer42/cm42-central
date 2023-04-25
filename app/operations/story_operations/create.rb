module StoryOperations
  class Create
    include Dry::Monads[:result, :do]

    def call(story:, current_user:)
      ActiveRecord::Base.transaction do
        story = yield save_story(story)
        yield create_changesets(story)
        yield create_activity(story, current_user: current_user)

        yield notify_users(story)
        yield notify_changes(story)

        Success(story)
      end
    rescue
      Failure(story)
    end

    private

    def save_story(story)
      if story.save
        Success(story)
      else
        Failure(story)
      end
    end

    def create_changesets(story)
      story.changesets.create
      Success(story)
    end

    def notify_users(story)
      Success StoryOperations::UserNotification.notify_users(story)
    end

    def notify_changes(story)
      Success StoryOperations::PusherNotification.notify_changes(story)
    end

    def create_activity(story, current_user:)
      Success ::Base::ActivityRecording.create_activity(
        story,
        current_user: current_user,
        action: 'create'
      )
    end
  end
end
