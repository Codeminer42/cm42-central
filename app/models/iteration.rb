class Iteration < Struct.new(:project, :stories, :start_date, :number, :key)
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

  def sortable?
    %w[todo unstarted icebox].include?(key)
  end

  def column_key
    "##{key}"
  end
end

