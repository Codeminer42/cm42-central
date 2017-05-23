class Story < ActiveRecord::Base
  include Central::Support::StoryConcern::Attributes
  include Central::Support::StoryConcern::Associations
  include Central::Support::StoryConcern::Validations
  include Central::Support::StoryConcern::Transitions
  include Central::Support::StoryConcern::Scopes
  include Central::Support::StoryConcern::Callbacks
  include Central::Support::StoryConcern::CSV

  module ReadOnlyDocuments
    def documents=(attachments)
      raise ActiveRecord::ReadOnlyRecord if readonly?
      # convert from ActionController::Parameters which doesn't have symbolize_keys!
      super(attachments.map { |hash| hash.to_hash }) if attachments
    end

    def documents_attributes
      documents.map(&:public_id)
    end
  end

  has_many :changesets, dependent: :destroy
  has_many :tasks, dependent: :destroy

  has_attachments :documents, accept: [:raw, :jpg, :png, :psd, :docx, :xlsx, :doc, :xls, :pdf], maximum: 10
  attr_accessor :documents_attributes_was
  prepend ReadOnlyDocuments

  include PgSearch
  pg_search_scope :search,
    against: {
      title: 'A',
      description: 'B',
      labels: 'C'
    },
    using: {
      tsearch: {
        prefix: true,
        negation: true
      }
    }

  pg_search_scope :search_labels,
    against: :labels,
    ranked_by: ":trigram"

  JSON_ATTRIBUTES = [
    "title", "release_date", "accepted_at", "created_at", "updated_at", "description",
    "project_id", "story_type", "owned_by_id", "requested_by_id",
    "owned_by_name", "owned_by_initials",  "requested_by_name", "estimate",
    "state", "position", "id", "labels"
  ]
  JSON_METHODS = [
    "errors", "notes", "documents", "tasks"
  ]

  def as_json(options = {})
    super(only: JSON_ATTRIBUTES, methods: JSON_METHODS)
  end

  def readonly?
    !accepted_at_changed? && accepted_at.present?
  end

  # Set the project start date to today if the project start date is nil
  # and the state is changing to any state other than 'unstarted' or 'unscheduled'
  def fix_project_start_date
    return unless state_changed?
    return unless project && !project.start_date && !['unstarted', 'unscheduled'].include?(state)
    project.start_date = Date.current
  end

  # If a story's 'accepted at' date is prior to the project start date,
  # the project start date should be moved back accordingly
  def fix_story_accepted_at
    return unless accepted_at_changed? && accepted_at && accepted_at < project.start_date
    project.start_date = accepted_at
  end

  def release_date=(val)
    return unless val.present?

    date = Chronic.parse(val)
    write_attribute(:release_date, date)
  end
end
