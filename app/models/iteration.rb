class Iteration < Struct.new(:project, :stories, :start_date, :number, :key)
  extend ActiveModel::Naming
  include ActiveModel::Conversion

  def cache_key
    @cache_key ||= begin
      timestamp = stories.maximum(:updated_at)&.utc.to_i
      "iterations/#{project.id}-#{key}-#{timestamp}"
    end
  end

  def to_partial_path
    "iterations/iteration"
  end

  def current?
    start_date == Time.zone.now.beginning_of_week
  end

  def lazy?
    start_date && start_date <= 5.weeks.ago
  end

  def sortable?
    %w[todo unstarted icebox].include?(key)
  end

  def column_key
    "##{key}"
  end

  def persisted?
    true
  end

  def to_param
    number
  end
end

