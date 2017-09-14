class BurnDownCalculator
  include Service

  def call(project)
    @project = project
    @service_full = IterationService.new(project, since: nil)
    @backlog_iterations = service_full.backlog_iterations

    calculate_points

    @delivered_group
  end

  private

  attr_reader :project, :service_full, :backlog_iterations

  def initialize_delivered_group
    @delivered_group = [
      { name: 'today', data: { Date.current => group[Date.current] } },
      { name: 'real',  data: group },
      { name: 'ideal', data: group.dup }
    ]
  end

  def iteration_days
    @iteration_days ||= (service_full.start_date..backlog_iterations.last.start_date).to_a
  end

  def total_points
    @total_points ||= backlog_iterations.first.points
  end

  def points_per_day
    @points_per_day ||= total_points.to_f / (group.keys.size - 1)
  end

  def calculate_points
    initialize_delivered_group

    remaining_points = initial_points = total_points

    real = @delivered_group[1][:data]
    real.keys.each do |key|
      remaining_points -= real[key]
      real[key] = remaining_points
    end

    ideal = @delivered_group[2][:data]
    ideal.keys.each do |key|
      ideal[key] = initial_points
      initial_points -= points_per_day
    end
  end

  def group
    @group ||= {}.tap do |group|
      iteration_days.each do |day|
        group[day] = stories_group[day] ? stories_group[day].sum { |story| story.estimate || 0 } : 0
      end
    end
  end

  def stories_group
    @stories_group ||= backlog_iterations
                       .first
                       .to_a
                       .select(&:delivered_at)
                       .sort_by(&:delivered_at)
                       .group_by { |story| story.delivered_at.to_date }
  end
end
