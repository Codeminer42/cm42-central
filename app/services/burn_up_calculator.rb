class BurnUpCalculator
  include Service

  def call(project)
    @service_full = IterationService.new(project, since: nil)

    calculate_points

    @report_data
  end

  private

  attr_reader :service_full

  def initialize_group_by_day
    @report_data = {
      group_by_day: [
        { name: 'today', data: { Date.current => service_full.group_by_day[Date.current] } },
        { name: 'real',  data: service_full.group_by_day },
        { name: 'ideal', data: service_full.group_by_day.dup }
      ],
      total_backlog_points: total_backlog_points
    }
  end

  def total_backlog_points
    stories = service_full.instance_variable_get('@stories')
    stories.reject(&:accepted?).map(&:estimate).compact.sum
  end

  def points_per_day
    @points_per_day ||= total_backlog_points.to_f / service_full.group_by_day.keys.size
  end

  def calculate_points
    initial_points = 0

    initialize_group_by_day

    @report_data[:group_by_day].last[:data].keys.each do |key|
      @report_data[:group_by_day].last[:data][key] = initial_points
      initial_points += points_per_day
    end
  end
end
