module Iterations
  class PastIteration
    include Virtus.model

    attribute :start_date, Date
    attribute :end_date, Date
    attribute :iteration_number, Integer
    attribute :stories, Array[Story]
    attribute :points, Integer

  end
end
