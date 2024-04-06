class SortStories
  POSITION_NORMALIZER = 1

  def initialize(ordered_ids, scope:)
    @ordered_ids = ordered_ids
    @scope = scope
  end

  def call
    @scope.find(@ordered_ids) # just to trigger policy
    @ordered_ids.map.with_index do |id, index|
      @scope.update id, position: index + POSITION_NORMALIZER
    end
  end
end
