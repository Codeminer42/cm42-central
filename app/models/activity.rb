class Activity < ActiveRecord::Base
  belongs_to :project
  belongs_to :user
  belongs_to :subject, polymorphic: true

  validates :action, presence: true, inclusion: { in: %w[create update destroy] }
  validates :project, presence: true
  validates :user, presence: true
  validates :subject, presence: true, subject_changed: true

  serialize :subject_changes, type: Hash, coder: JSON

  before_save :parse_changes

  def compile_changes
    @compile_changes ||= Change.from(self)
  end

  def displayable?
    compile_changes.any?
  end

  def state_change?
    compile_changes.length == 1 && compile_changes[0].attribute == "state"
  end

  def move?
    compile_changes.length == 1 && compile_changes[0].attribute == "position"
  end

  def move_direction
    change = compile_changes[0]
    change.old > change.new ? "up" : "down"
  end

  scope :projects, lambda { |ids|
    where(project_id: ids) if ids
  }
  scope :since, lambda { |date|
    where('created_at > ?', date.beginning_of_day) if date
  }
  scope :by_story, ->(story_id) { where(subject_id: story_id, subject_type: 'Story') }

  def decorate
    ActivityPresenter.new(self)
  end

  def self.fetch_polymorphic(ids, since)
    stories = where("subject_type in ('Project', 'Story')")
      .includes(:user, :subject)
      .projects(ids)
      .since(since)
      .order(:id).to_a
    stories += where("subject_type in ('Comment', 'Task')")
      .includes(:user, subject: [:story])
      .projects(ids)
      .since(since)
      .order(:id).to_a
    stories = stories.group_by(&:subject_id)

    [].tap do |new_activities|
      stories.values.each do |activities|
        sub_list = activities.sort_by(&:updated_at)
        first_story = sub_list.shift
        first_story.merge_story!(sub_list.shift) until sub_list.empty?
        new_activities << first_story unless first_story.subject_changes.empty?
      end
    end
  end

  def self.grouped_activities(allowed_projects, since)
    fetch_polymorphic(allowed_projects.pluck(:id), since).group_by do |activity|
      activity.created_at.beginning_of_day
    end.map do |date, activities|
      [
        date,
        activities.group_by(&:project_id).map do |project_id, activities|
          [
            allowed_projects.find { |p| p.id == project_id },
            activities.group_by do |activity|
              activity.subject_destroyed_type || activity.subject_type
            end.map do |subject_type, activities|
              [
                subject_type,
                activities.map { |a| GroupedActivityPresenter.new(a) },
              ]
            end
          ]
        end
      ]
    end
  end

  def merge_story!(activity)
    return if subject_type != 'Story' # story only
    return if subject_id != activity.subject_id # only merge the exact same story change
    return if updated_at > activity.updated_at # only merge from future changes
    return if activity.subject_changes.blank?

    self.subject_changes = {} if subject_changes.nil?
    self.action = activity.action

    activity.subject_changes.keys.each do |key|
      if subject_changes[key]
        subject_changes[key][-1] = activity.subject_changes[key][-1]
      else
        subject_changes[key] = activity.subject_changes[key]
      end
      subject_changes.delete(key) if subject_changes[key].first == subject_changes[key].last
    end
  end

  def parse_changes
    if action == 'update'
      self.subject_changes = subject.saved_changes
    elsif action == 'destroy'
      self.subject_changes = subject.attributes
      self.subject_destroyed_type = subject.class.name
      self.subject = nil
    end
  end
end
