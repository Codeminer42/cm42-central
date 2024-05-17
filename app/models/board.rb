class Board < Struct.new(:project)
  def to_partial_path
    "projects/board"
  end

  def past_iterations
    project_start_date = project.start_date.beginning_of_week
    end_time = Time.zone.now.last_week
    (project_start_date..end_time).step(7).map.with_index(1) do |start_date, index|
      stories = project.stories.accepted_between(start_date, start_date.end_of_week).order(:accepted_at)
      Iteration.new(
        project,
        stories,
        start_date,
        index,
        index
      )
    end
  end

  def current_accepted
    start_date = Time.zone.now.beginning_of_week
    stories = project.stories.accepted_after(start_date).order(:position)
    number = ((Date.today.beginning_of_week - project.start_date.beginning_of_week) / 7 + 1).to_i
    Iteration.new(
      project,
      stories,
      start_date,
      number,
      number
    )
  end

  def current_delivered
    stories = project.stories.delivered.order(:position)
    Iteration.new(
      project,
      stories,
      nil,
      nil,
      "delivered"
    )
  end

  def current_in_progress
    stories = project.stories.in_progress.order(:position)
    Iteration.new(
      project,
      stories,
      nil,
      nil,
      "in_progress"
    )
  end

  def current_unstarted
    stories = project.stories.backlog.order(:position)
    Iteration.new(
      project,
      stories,
      nil,
      nil,
      "unstarted"
    )
  end

  def current_icebox
    stories = project.stories.chilly_bin.order(:position)
    Iteration.new(
      project,
      stories,
      nil,
      nil,
      "icebox"
    )
  end
end

