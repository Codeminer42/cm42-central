class SortStories
  POSITION_NORMALIZER = 1

  def initialize(ordered_ids, scope:)
    @ordered_ids = ordered_ids
    @scope = scope
  end

  def call
    @scope.find(@ordered_ids).map.with_index do |story, index|
      unless story.readonly?
        story.update! position: index + POSITION_NORMALIZER
      end
    end
  end
end
