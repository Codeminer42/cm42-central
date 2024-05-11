class Iteration < Struct.new(:project, :stories, :start_date, :number, :key)
  def self.past project
    project_start_date = project.start_date.beginning_of_week
    end_time = Time.zone.now.last_week
    (project_start_date..end_time).step(7).map.with_index(1) do |start_date, index|
      stories = project.stories.accepted_between(start_date, start_date.end_of_week).order(:accepted_at)
      new(
        project,
        stories,
        start_date,
        index,
        index
      )
    end
  end

  def self.current_accepted project
    start_date = Time.zone.now.beginning_of_week
    stories = project.stories.accepted_after(start_date).order(:position)
    number = ((Date.today.beginning_of_week - project.start_date.beginning_of_week) / 7 + 1).to_i
    new(
      project,
      stories,
      start_date,
      number,
      number
    )
  end

  def self.current_delivered project
    stories = project.stories.delivered.order(:position)
    new(
      project,
      stories,
      nil,
      nil,
      "in_progress"
    )
  end 

  def self.current_in_progress project
    stories = project.stories.in_progress.order(:position)
    new(
      project,
      stories,
      nil,
      nil,
      "in_progress"
    )
  end 

  def self.current_unstarted project
    stories = project.stories.backlog.order(:position)
    new(
      project,
      stories,
      nil,
      nil,
      "unstarted"
    )
  end

  def self.current_icebox project
    stories = project.stories.chilly_bin.order(:position)
    new(
      project,
      stories,
      nil,
      nil,
      "icebox"
    )
  end

  def cache_key
    @cache_key ||= begin
      timestamp = stories.maximum(:updated_at)&.utc.to_i
      "iterations/#{project.id}-#{key}-#{timestamp}"
    end
  end


  def to_partial_path
    "stories/iteration"
  end

  def points
    0
  end
end

