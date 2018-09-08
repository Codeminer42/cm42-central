module Iterations
  class PastIteration
    include Virtus.model

    attribute :start_date, DateTime
    attribute :end_date, DateTime
    attribute :iteration_number, Integer
    attribute :stories, Array[Story]
    attribute :points, Integer

    def points
      @points ||= stories.to_a.map(&:estimate).compact.sum
    end
  end
end
