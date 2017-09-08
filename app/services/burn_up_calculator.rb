class BurnUpCalculator
  include Service

  def call(project)
    @service_full = IterationService.new(project, since: nil)

    calculate_points

    @group_by_day
  end

  private

  attr_reader :service_full

  def initialize_group_by_day
    @group_by_day = [
      { name: 'today', data: { Date.current => service_full.group_by_day[Date.current] } },
      { name: 'real',  data: service_full.group_by_day },
      { name: 'ideal', data: service_full.group_by_day.dup }
    ]
  end

  def total_backlog_points
    stories = service_full.instance_variable_get('@stories')
    stories.map(&:estimate).compact.sum
  end

  def points_per_day
    @points_per_day ||= total_backlog_points.to_f / service_full.group_by_day.keys.size
  end

  def calculate_points
    initial_points = 0

    initialize_group_by_day

    @group_by_day.last[:data].keys.each do |key|
      @group_by_day.last[:data][key] = initial_points
      initial_points += points_per_day
    end
  end
end
