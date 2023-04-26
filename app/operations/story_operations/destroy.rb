module StoryOperations
  class Destroy
    include Dry::Monads[:result, :do]

    def call(story:, current_user:)
      story = yield delete_story(story)
      yield notify_changes(story)
      yield create_activity(story, current_user: current_user)

      Success(story)
    end

    def delete_story(story)
      Success(story.destroy)
    end

    def notify_changes(story)
      Success ::StoryOperations::PusherNotification.notify_changes(story)
    end

    def create_activity(story, current_user:)
      Success ::Base::ActivityRecording.create_activity(
        story,
        current_user: current_user,
        action: 'destroy'
      )
    end
  end
end
