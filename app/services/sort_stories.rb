class SortStories
  POSITION_NORMALIZER = 1

  def initialize(ordered_ids, scope:)
    @ordered_ids = ordered_ids
    @stories = scope.find(@ordered_ids)
  end

  def call
    @stories.map { |story| update_position(story) }.sort_by(&:position)
  end

  def update_position(story)
    story.tap { |s| s.update_attributes position: position_for(story) }
  end

  def position_for(story)
    @ordered_ids.index(story.id.to_s) + POSITION_NORMALIZER
  end
end
