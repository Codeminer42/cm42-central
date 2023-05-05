module StoryOperations
  class UpdateAll
    include Dry::Monads[:result, :do]

    def call(stories:, data:, current_user:)
      stories = yield update_stories(
        stories: stories,
        data: data,
        current_user: current_user
      )

      Success(stories)
    rescue
      Failure(false)
    end

    private

    # TODO: we should probably use a transaction here
    def update_stories(stories:, data:, current_user:)
      updated_stories = stories.map do |story|
        Update.call(story: story, data: data, current_user: current_user)
      end

      return Failure(updated_stories) unless updated_stories.all?(&:success?)

      Success(updated_stories)
    end
  end
end
