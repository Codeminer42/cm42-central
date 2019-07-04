module Iterations
  class ProjectIterations
    DAYS_IN_A_WEEK = 7

    def initialize(project:)
      @project = project
      @stories = project_accepted_stories
    end

    def current_iteration_start
      first_iteration_expected_start_date + (number_of_iterations * iteration_length_in_days)
    end

    def past_iterations
      start_at = project.start_date
      end_at = iteration_end_date(first_iteration_expected_start_date)

      (0...number_of_iterations).map do |iteration_number|
        if iteration_number != 0
          start_at = iteration_start_date(iteration_number)
          end_at = iteration_end_date(start_at)
        end

        iteration_stories = stories_between(start_at, end_at)

        PastIteration.new(
          start_date: start_at,
          end_date: end_at,
          iteration_number: iteration_number + 1,
          points: points_of_stories(iteration_stories),
          has_stories: iteration_stories.any?
        )
      end
    end

    private

    attr_reader :project, :stories

    def points_of_stories(stories)
      stories.to_a.map(&:estimate).compact.sum
    end

    def stories_between(start_at, end_at)
      stories.select do |story|
        story.accepted_at.to_date.between?(start_at, end_at)
      end
    end

    def project_accepted_stories
      project
        .stories
        .with_dependencies
        .accepted
        .order(:accepted_at)
    end

    def missing_days_from_first_sprint
      (project.start_date.wday - project.iteration_start_day) % DAYS_IN_A_WEEK
    end

    def first_iteration_expected_start_date
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
      first_iteration_expected_start_date + iteration_days
    end

    def iteration_end_date(start_date)
      start_date + (iteration_length_in_days - 1)
    end

    def days_since_first_iteration_start
      Date.current - first_iteration_expected_start_date
    end
  end
end
