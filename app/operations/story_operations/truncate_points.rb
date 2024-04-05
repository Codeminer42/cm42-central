module StoryOperations
  class TruncatePoints
    include Operation

    def initialize(project:)
      @project = project
    end

    attr_reader :project

    def call
      max = project.point_values.max
      updated_projects = project.stories
        .where.not(estimate: nil)
        .where("estimate > ?", max || 0)
        .update_all(estimate: max)

      Success(updated_projects)
    rescue
      Failure()
    end
  end
end

