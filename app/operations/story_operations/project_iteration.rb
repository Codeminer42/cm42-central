module StoryOperations
  module ProjectIteration
    def current_iteration_start_date
      project_start_date + (project_number_of_past_iterations * iteration_length_in_days).days
    end

    def project_number_of_past_iterations
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
      attr_accessor :start_date, :end_date, :points

      def initialize(start_date, end_date, project)
        @start_date = start_date
        @end_date = end_date
        iteration_stories = select_iteration_stories(project.stories)
        @points = sum_stories_points(iteration_stories)
      end

      private

      def sum_stories_points(iteration_stories)
        points = 0
        iteration_stories.each do |story|
          points += story.estimate || 0
        end
        points
      end

      def select_iteration_stories(stories)
        stories.where('accepted_at >= ? AND accepted_at < ?', @start_date, @end_date)
      end
    end
  end
end
