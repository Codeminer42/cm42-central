class Board < Struct.new(:project, :query)
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

  def iteration_header
    start_date = Time.zone.now.beginning_of_week
    number = ((Date.today.beginning_of_week - project.start_date.beginning_of_week) / 7 + 1).to_i
    Iteration.new(
      project,
      project.stories.none,
      start_date,
      number,
      number
    )
  end

  def current_accepted
    start_date = Time.zone.now.beginning_of_week
    stories = project.stories.accepted_after(start_date).order(:accepted_at)
    Iteration.new(
      project,
      stories,
      nil,
      nil,
      "current_accepted"
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

  def current_todo
    stories = project.stories.todo.order(:position)
    Iteration.new(
      project,
      stories,
      nil,
      nil,
      "todo"
    )
  end

  def current_unstarted
    stories = project.stories.unstarted.order(:position)
    Iteration.new(
      project,
      stories,
      nil,
      nil,
      "unstarted"
    )
  end

  def current_icebox
    stories = project.stories.icebox.order(:position)
    Iteration.new(
      project,
      stories,
      nil,
      nil,
      "icebox"
    )
  end

  def recent_activities
    project.activities
      .where(subject_type: %w[Story Comment])
      .order(created_at: :desc)
      .limit(50)
  end

  def recent_activity_groups
    groups = recent_activities.group_by do |activity|
      if activity.subject_type == "Comment"
        activity.subject&.story_id
      elsif activity.subject_destroyed_type == 'Comment'
        activity.subject_changes["story_id"]
      elsif activity.subject_destroyed_type == 'Story'
        activity.subject_changes["id"]
      else
        activity.subject_id
      end
    end

    groups.delete(nil)

    groups.reduce([]) do |array, (story_id, activities)|
      activities.select(&:displayable?).each do |activity|
        activity_group = array.last
        if activity_group&.cover?(activity)
          activity_group << activity
        else
          array << ActivityGroup.new(activity)
        end
      end
      array
    end.sort_by(&:timestamp).reverse
  end

  def search_results
    @search ||= StorySearch.query(project.stories, query)
  end

  def search?
    query.present?
  end
end

