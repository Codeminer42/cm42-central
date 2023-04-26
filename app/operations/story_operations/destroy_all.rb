module StoryOperations
  class DestroyAll
    include Dry::Monads[:result, :do]

    def call(stories:, current_user:)
      deleted_stories = yield destroy_stories(
        stories: stories
      )

      yield create_activity(deleted_stories, current_user: current_user)

      Success(deleted_stories)
    rescue
      Failure(false)
    end

    private

    def destroy_stories(stories:)
      deleted_stories = stories.destroy_all
      Success(deleted_stories)
    end

    def create_activity(stories, current_user:)
      Success ::Base::ActivityRecording.create_activity(
        stories,
        current_user: current_user,
        action: 'destroy'
      )
    end
  end
end
