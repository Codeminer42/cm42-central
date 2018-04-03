module StoryOperations
  module ProjectIteration
    def current_iteration_start_date
      project_start_date + (number_of_iterations * iteration_length_in_days)
    end

    def number_of_iterations
      (days_since_project_start / iteration_length_in_days).floor
    end

    def days_since_project_start
      Date.current - project_start_date
    end

    def iteration_length_in_days
      @project.iteration_length * 7
    end

    def project_start_date
      @project.start_date
    end

    class Iteration
      attr_reader :start_date, :end_date, :points

      def initialize(start_date, end_date, project)
        @start_date = start_date
        @end_date = end_date
        iteration_stories = select_iteration_stories(project.stories)
        @points = sum_stories_points(iteration_stories)
      end

      private

      def sum_stories_points(iteration_stories)
        iteration_stories.map { |story| story.estimate }.sum
      end

      def select_iteration_stories(stories)
        stories.where('accepted_at >= ? AND accepted_at < ?', @start_date, @end_date)
      end
    end
  end
end
