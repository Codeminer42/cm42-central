module StoryOperations
  class ReadAll
    include Operation

    delegate :past_iterations, :current_iteration_start, to: :iterations

    def initialize(project:)
      @project = project
    end

    def call
      yield active_stories
      yield project_iterations

      Success(
        active_stories: @active_stories,
        past_iterations: past_iterations
      )
    end

    private

    attr_reader :project

    def iterations
      @project_iterations ||= Iterations::ProjectIterations.new(project: project)
    end

    def project_iterations
      Success(iterations)
    end

    def active_stories
      @active_stories ||= begin
        project
          .stories
          .with_dependencies
          .where("state != 'accepted' OR accepted_at >= ?", current_iteration_start)
          .order('updated_at DESC')
      end

      Success(@active_stories)
    end
  end
end
