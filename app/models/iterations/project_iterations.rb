module Iterations
  class ProjectIterations
    def initialize(project:)
      @project = project
    end

    def current_iteration_start
      project_start_date + (length * iteration_length_in_days)
    end

    def past_iterations
      (0...length).map do |iteration_number|
        start_at = start_date(iteration_number)
        end_at = end_date(start_at)

        PastIteration.new(
          start_date: start_at,
          end_date: end_at,
          stories: stories_from(start_at, end_at),
          iteration_number: iteration_number + 1
        )
      end
    end

    private

    attr_reader :project

    def stories_from(start_at, end_at)
      stories.select do |story|
        story.accepted_at >= start_at && story.accepted_at <= end_at
      end
    end

    def stories
      @stories ||= begin
        project
          .stories
          .with_dependencies
          .where(state: 'accepted')
          .where.not(accepted_at: nil)
          .order(:accepted_at)
      end
    end

    def length
      (days_since_project_start / iteration_length_in_days).floor
    end

    def iteration_length_in_days
      project.iteration_length * 7
    end

    def project_start_date
      project.start_date
    end

    def start_date(iteration_number)
      project_start_date + (iteration_number * iteration_length_in_days)
    end

    def end_date(start_date)
      start_date + iteration_length_in_days - 1
    end

    def days_since_project_start
      Date.current - project_start_date
    end
  end
end
