class IterationService
  DAYS_IN_WEEK = (1.week / 1.day)
  VELOCITY_ITERATIONS = 3
  STD_DEV_ITERATIONS = 10
  DEFAULT_VELOCITY = 10

  attr_reader :project, :current_time, :backlog

  delegate :start_date, :start_date=,
    :iteration_length, :iteration_length=,
    :iteration_start_day, :iteration_start_day=,
    to: :project

  def initialize(project, since: nil, current_time: Time.zone.now)
    @project = project
    @current_time = current_time

    @stories = fetch_stories!(since)

    @accepted_stories = @stories.
      select { |story| story.column == '#done' }.
      select { |story| story.accepted_at < iteration_start_date(@current_time) }

    calculate_iterations!

    @backlog = ( @stories - @accepted_stories ).guaranteed_sort_by(&:position)
  end

  def fetch_stories!(since = nil)
    relation = project.stories.includes(:owned_by, :notes)
    relation = relation.where("accepted_at > ? or accepted_at is null", since).order(:position) if since
    relation.to_a.map { |story| story.iteration_service = self; story }
  end

  def iteration_start_date(date = nil)
    date = start_date if date.nil?
    iteration_start_date = date.beginning_of_day
    day_difference = iteration_start_date.wday - iteration_start_day
    if !day_difference.zero?
      day_difference += DAYS_IN_WEEK if day_difference < 0
      iteration_start_date -= day_difference.days
    end
    iteration_start_date
  end

  def iteration_number_for_date(compare_date)
    compare_date      = compare_date.to_time if compare_date.is_a?(Date)
    days_apart        = ( compare_date - iteration_start_date ) / 1.day
    days_in_iteration = iteration_length * DAYS_IN_WEEK
    ( days_apart / days_in_iteration ).floor + 1
  end

  def date_for_iteration_number(iteration_number)
    difference = (iteration_length * DAYS_IN_WEEK) * (iteration_number - 1)
    iteration_start_date + difference.days
  end

  def current_iteration_number
    iteration_number_for_date(@current_time)
  end

  def calculate_iterations!
    @accepted_stories.each do |record|
      record.iteration_number     = iteration_number_for_date(record.accepted_at)
      record.iteration_start_date = date_for_iteration_number(record.iteration_number)
    end
  end

  def group_by_day(range = nil)
    @group_by_day = {}
    @group_by_day[range] ||= begin
      accepted = @accepted_stories
      accepted = accepted.select  { |story| story.accepted_at >= range.first && story.accepted_at < range.last } if range
      accepted += backlog_iterations.first.select { |story| story.accepted_at }
      accepted = accepted.sort_by { |story| story.accepted_at }.group_by { |story| story.accepted_at.to_date }

      last_key = nil
      accepted.keys.each do |key|
        accepted[key] = accepted[key].sum { |story| story.estimate || 0 }
        accepted[key] += accepted[last_key] unless last_key.nil?
        last_key = key
      end

      {}.tap do |group|
        next_date = project.start_date
        last_date = backlog_iterations.last.start_date + ( project.iteration_length * DAYS_IN_WEEK )
        while next_date < last_date
          group.merge!(next_date => accepted.fetch(next_date, group.fetch(next_date - 1.day, 0)))
          next_date += 1.day
        end
      end
    end
  end

  def group_by_iteration
    @group_by_iteration ||= @accepted_stories.
      group_by { |story| story.iteration_number }.
      reduce({}) do |group, iteration|
        group.merge(iteration.first => stories_estimates(iteration.last))
      end
  end

  def group_by_all_iterations
    iterations = (1...current_iteration_number).map { |num| [num, [0]] }

    Hash[iterations].merge(group_by_iteration)
  end

  def stories_estimates(stories)
    stories.map do |story|
      if Story::ESTIMABLE_TYPES.include? story.story_type
        story.estimate || 0
      else
        0
      end
    end
  end

  def group_by_velocity
    @group_by_velocity ||= group_by_all_iterations.reduce({}) do |group, iteration|
      group.merge(iteration.first => iteration.last.reduce(&:+))
    end
  end

  def bugs_impact(stories)
    stories.map do |story|
      if Story::ESTIMABLE_TYPES.include? story.story_type
        0
      else
        1
      end
    end
  end

  def group_by_bugs
    @group_by_bugs ||= @accepted_stories.
      group_by { |story| story.iteration_number }.
      reduce({}) do |group, iteration|
        group.merge(iteration.first => bugs_impact(iteration.last))
      end.
      reduce({}) do |group, iteration|
        group.merge(iteration.first => iteration.last.reduce(&:+))
      end
  end

  def velocity(number_of_iterations = VELOCITY_ITERATIONS)
    return DEFAULT_VELOCITY if group_by_all_iterations.size.zero?
    @velocity ||= {}
    @velocity[number_of_iterations] ||= begin
      number_of_iterations = group_by_all_iterations.size if number_of_iterations > group_by_all_iterations.size
      return 1 if number_of_iterations.zero?

      iterations = Statistics.slice_to_sample_size(group_by_velocity.values, number_of_iterations)

      if iterations.size > 0
        velocity = (Statistics.sum(iterations) / Statistics.total(iterations)).floor
        velocity < 1 ? 1 : velocity
      else
        1
      end
    end
  end

  def group_by_developer
    @group_by_developer ||= begin
      min_iteration = @accepted_stories.map(&:iteration_number).min
      max_iteration = @accepted_stories.map(&:iteration_number).max
      @accepted_stories.
        group_by { |story| story.owned_by.name }.
        map do |owner|
          # all multiple series must have all the same keys or they will mess the graph
          data = (min_iteration..max_iteration).reduce({}) { |group, key| group.merge(key => 0)}
          owner.last.group_by { |story| story.iteration_number }.
            each do |iteration|
              data[iteration.first] = stories_estimates(iteration.last).reduce(&:+)
            end
          { name: owner.first, data: data }
        end
    end
  end

  def completed_iterations
    (1...current_iteration_number).map do |number|
      iteration = Iteration.new(self, number)
      stories = @accepted_stories.select do |story|
        (iteration.starts_at..iteration.ends_at).cover?(story.accepted_at)
      end.sort_by(&:position)
      iteration.replace stories
    end
  end

  def backlog_iterations(velocity_value = velocity)
    velocity_value = 1 if velocity_value < 1
    @backlog_iterations ||= {}
    @backlog_iterations[velocity_value] ||= begin
      current_iteration = Iteration.new(self, current_iteration_number, velocity_value)
      backlog_iteration = Iteration.new(self, current_iteration_number + 1, velocity_value)
      iterations = [current_iteration, backlog_iteration]
      @backlog.
        select { |story| story.column != '#chilly_bin' }.
        each do |story|
        if current_iteration.can_take_story?(story)
          current_iteration << story
        else
          if !backlog_iteration.can_take_story?(story)
            # Iterations sometimes 'overflow', i.e. an iteration may contain a
            # 5 point story but the project velocity is 1.  In this case, the
            # next iteration that can have a story added is the current + 4.
            next_number       = backlog_iteration.number + 1 + (backlog_iteration.overflows_by / velocity_value).ceil
            backlog_iteration = Iteration.new(self, next_number, velocity_value)
            iterations << backlog_iteration
          end
          backlog_iteration << story
        end
      end
      current_iteration.sort_by! do |s|
        [s.accepted_at || Time.zone.now, s.position]
      end
      iterations
    end
  end

  def current_iteration_details
    current_iteration = backlog_iterations.first
    %w(started finished delivered accepted rejected).reduce({}) do |data, state|
      data.merge(state => current_iteration.
                 select { |story| story.state == state }.
                 reduce(0) { |points, story| points + (story.estimate || 0) } )
    end
  end

  def volatility(number_of_iterations = STD_DEV_ITERATIONS)
    Statistics.volatility(group_by_velocity.values, number_of_iterations)
  end

  def standard_deviation(number_of_iterations = STD_DEV_ITERATIONS)
    Statistics.standard_deviation(group_by_velocity.values, number_of_iterations)
  end

  # with calculate_worst = false calculates the final project date based on the average velocity for the past 3 iterations
  # with calculate_worst = true add the standard deviation of the velocity for the past 10 iterations
  def backlog_date(calculate_worst = false)
    iterations            = backlog_iterations(velocity)
    last_iteration_number = iterations.last.number
    if calculate_worst
      std_dev                     = Statistics.standard_deviation(group_by_velocity.values, STD_DEV_ITERATIONS)
      ten_iterations_slice        = Statistics.slice_to_sample_size(group_by_velocity.values, STD_DEV_ITERATIONS)
      mean_of_last_ten_iterations = Statistics.mean(ten_iterations_slice)
      if std_dev > 0.0 && mean_of_last_ten_iterations > 0.0
        extra_iterations            = ( std_dev * iterations.size / mean_of_last_ten_iterations ).round
        last_iteration_number      += extra_iterations
      end
    end
    [ last_iteration_number, date_for_iteration_number(last_iteration_number) + project.iteration_length.days ]
  end
end
