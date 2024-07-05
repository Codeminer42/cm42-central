module IterationOperations
  class Read
    include Operation

    def initialize(start_date:, end_date:, project:)
      @start_date = start_date
      @end_date = end_date
      @project = project
    end

    def call
      Success(stories: stories)
    end

    private

    attr_reader :start_date, :end_date, :project

    def stories
      @stories ||= begin
        project
          .stories
          .with_dependencies
          .accepted_between(start_date, end_date)
      end
    end
  end
end
