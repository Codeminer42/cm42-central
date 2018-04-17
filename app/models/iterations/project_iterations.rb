module Iterations
  class ProjectIterations
    def initialize(project:)
      @project = project
    end

    def current_iteration_start
      project_start_date + (length * iteration_length_in_days)
    end

    def past_iterations
      (0...length).map do |iteration_number|
        start_date = start_date(iteration_number)
        end_date = end_date(start_date)
        PastIteration.new(start_date: start_date,
                          end_date: end_date,
                          project: @project,
                          iteration_number: iteration_number + 1)
      end
    end

    private

    def length
      (days_since_project_start / iteration_length_in_days).floor
    end

    def iteration_length_in_days
      @project.iteration_length * 7
    end

    def project_start_date
      @project.start_date
    end

    def start_date(iteration_number)
      project_start_date + (iteration_number * iteration_length_in_days)
    end

    def end_date(start_date)
      start_date + iteration_length_in_days - 1
    end

    def days_since_project_start
      Date.current - project_start_date
    end
  end
end
