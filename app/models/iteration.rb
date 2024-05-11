class Iteration < Data.define(:stories, :start_date, :number)
  def to_partial_path
    "stories/iteration"
  end

  def self.compute project
    project_start_date = project.start_date.beginning_of_week
    end_time = Time.zone.now.last_week
    (project_start_date..end_time).step(7).map.with_index(1) do |start_date, index|
      stories = project.stories.accepted_between(start_date, start_date.end_of_week).with_dependencies
      new(stories:, start_date:, number: index)
    end
  end

  def self.current_accepted project
    start_date = Time.zone.now.beginning_of_week
    stories = project.stories.accepted_after(start_date).with_dependencies
    number = ((Date.today.beginning_of_week - project.start_date.beginning_of_week) / 7 + 1).to_i
    new(stories:, start_date:, number:)
  end

  def self.current_in_progress project
    new(
      stories: project.stories.in_progress.with_dependencies,
      start_date: nil,
      number: nil,
    )
  end 

  def self.current_unstarted project
    new(
      stories: project.stories.backlog.with_dependencies,
      start_date: nil,
      number: nil,
    )
  end

  def points
    0
  end
end

