module Iterations
  class PastIteration
    attr_reader :start_date, :end_date, :points, :iteration_number

    def initialize(start_date:, end_date:, project:, iteration_number: nil)
      @start_date = start_date
      @end_date = end_date
      @project = project
      @points = points
      @iteration_number = iteration_number
    end

    def points
      @points ||= stories.sum(:estimate)
    end

    def stories
      @stories ||= @project.stories.where(
        'accepted_at >= ? AND accepted_at <= ?',
        @start_date.beginning_of_day, @end_date.end_of_day
      )
    end
  end
end
