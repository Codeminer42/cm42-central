module StoryOperations
  class DestroyAll
    include Operation

    def initialize(stories:, current_user:)
      @stories = stories
      @current_user = current_user
    end

    def call
      yield destroy_stories
      yield create_activity

      Success(stories)
    rescue
      Failure(false)
    end

    private

    attr_reader :stories, :current_user, :deleted_stories

    def destroy_stories
      @deleted_stories = stories.destroy_all
      Success(stories)
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        deleted_stories,
        current_user: current_user,
        action: 'destroy'
      )
    end
  end
end
