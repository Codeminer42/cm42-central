module Iterations
  class PastIteration
    attr_reader :start_date, :end_date, :points

    def initialize(start_date:, end_date:, project:)
      @start_date = start_date
      @end_date = end_date
      @project = project
      @points = points
    end

    def points
      @points ||= stories.sum(:estimate)
    end

    def stories
      @stories ||= @project.stories.where(
        'accepted_at >= ? AND accepted_at <= ?', @start_date, @end_date
      )
    end
  end
end
