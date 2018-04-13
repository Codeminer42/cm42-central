module IterationOperations
  class Read
    def self.call(*args)
      new(*args).run
    end

    def initialize(start_date:, end_date:, project:)
      @start_date = start_date
      @end_date = end_date
      @project = project
    end

    def run
      {
        stories: stories
      }
    end

    private

    def stories
      Iterations::PastIteration.new(start_date: @start_date,
                                    end_date: @end_date,
                                    project: @project).stories
    end
  end
end
