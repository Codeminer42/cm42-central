class ActivityGroup
  def initialize activity
    @activities = Array(activity)
  end

  attr_reader :activities

  def cover? activity
    dates = @activities.map(&:created_at)
    min = dates.min - 5.minutes
    max = dates.max + 5.minutes
    (min..max).cover?(activity.created_at)
  end

  def << other
    @activities << other
  end

  def to_partial_path
    "activities/group"
  end

  def title
    @activities.first.decorate.title
  end

  def timestamp
    @activities.first.created_at
  end
end
