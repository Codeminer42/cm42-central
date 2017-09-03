class Changeset < ActiveRecord::Base
  belongs_to :project
  belongs_to :story

  validates :project, presence: true
  validates :story, presence: true

  before_validation :assign_project_from_story

  default_scope { order(:id) }

  scope :since, ->(id) { where('id > ?', id) }
  scope :until, ->(id) { where('id <= ?', id) }

  protected

  # If project_id is not already set, it can be inferred from the stories
  # project_id
  def assign_project_from_story
    self.project_id = story.project_id if project_id.nil? && !story_id.nil?
  end
end
