module StoryOperations
  class UpdateAll
    include Operation

    def initialize(stories:, stories_attrs:, current_user:)
      @stories = stories
      @stories_attrs = stories_attrs
      @current_user = current_user
    end

    def call
      yield update_stories

      Success(stories)
    rescue
      Failure(false)
    end

    private

    attr_reader :stories, :updated_stories, :stories_attrs, :current_user

    # TODO: we should probably use a transaction here
    def update_stories
      updated_stories = stories.map do |story|
        Update.call(story: story, story_attrs: stories_attrs, current_user: current_user)
      end

      return Failure(updated_stories) unless updated_stories.all?(&:success?)

      Success(updated_stories)
    end
  end
end
