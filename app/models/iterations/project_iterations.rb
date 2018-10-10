module Iterations
  class ProjectIterations
    DAYS_IN_A_WEEK = 7

    def initialize(project:)
      @project = project
    end

    def current_iteration_start
      first_iteration_start_date + (number_of_iterations * iteration_length_in_days)
    end

    def past_iterations
      (0...number_of_iterations).map do |iteration_number|
        start_at = iteration_start_date(iteration_number)
        end_at = iteration_end_date(start_at)

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
        story.accepted_at.to_date >= start_at && story.accepted_at.to_date <= end_at
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

    def missing_days_from_first_sprint
      project.start_date.wday - project.iteration_start_day
    end

    def first_iteration_start_date
      project.start_date - missing_days_from_first_sprint
    end

    def number_of_iterations
      (days_since_first_iteration_start / iteration_length_in_days).floor
    end

    def iteration_length_in_days
      project.iteration_length * DAYS_IN_A_WEEK
    end

    def iteration_start_date(iteration_number)
      iteration_days = iteration_number * iteration_length_in_days
      first_iteration_start_date + iteration_days
    end

    def iteration_end_date(start_date)
      start_date + (iteration_length_in_days - 1)
    end

    def days_since_first_iteration_start
      Date.current - first_iteration_start_date
    end
  end
end
