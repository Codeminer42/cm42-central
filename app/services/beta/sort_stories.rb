class Beta::SortStories
  def initialize(story, sort_params)
    @story = story
    @new_position = sort_params[:new_position]
    @new_state = sort_params[:state]
    @position = sort_params[:position]
  end

  def call
    update_current_story
    update_stories_positions
    stories
  end

  private

  def update_current_story
    @story.update(new_position: @new_position, state: @new_state, position: @position)
  end

  def stories_to_update
    stories.where.not(id: @story.id)
  end

  def update_stories_positions
    stories_to_update.update_all('new_position = new_position + 1')
  end

  def stories
    case @new_state
    when 'started', 'finished', 'delivered'
      @story.project.stories.in_progress.where('new_position >= ?', @new_position)
    when 'unstarted'
      @story.project.stories.backlog.where('new_position >= ?', @new_position)
    when 'unscheduled'
      @story.project.stories.chilly_bin.where('new_position >= ?', @new_position)
    end
  end
end
