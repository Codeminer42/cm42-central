class SortStories
  attr_reader :stories

  def initialize(ordered_ids)
    @ordered_ids = ordered_ids
    @stories = Story.find(@ordered_ids)
  end

  def call()
    @stories.each do |story|
      yield(story) if block_given?
      update_position(story)
    end.sort_by!(&:position)
  end

  private

  def update_position(story)
    story.update_attributes position: position_for(story)
  end

  def position_for(story)
    (@ordered_ids.index story.id.to_s) + 1
  end
end
