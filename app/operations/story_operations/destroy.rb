module StoryOperations
  class Destroy
    include Operation

    def initialize(story:, current_user:)
      @story = story
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield delete_story
        yield create_activity
        yield refresh_other_users
        Success(story)
      end
    end

    private

    attr_reader :story, :current_user

    def delete_story
      Success(story.destroy)
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        story,
        current_user: current_user,
        action: 'destroy'
      )
    end

    def refresh_other_users
      story.project.broadcast_refresh_later
      Success story
    end
  end
end
