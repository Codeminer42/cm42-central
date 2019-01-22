class Story < ApplicationRecord
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
      super(attachments.map(&:to_hash)) if attachments
    end

    def documents_attributes
      documents.map(&:public_id)
    end
  end

  scope :accepted, -> { where(state: 'accepted').where.not(accepted_at: nil) }

  scope :accepted_between, lambda { |start_date, end_date|
                             where('accepted_at >= ? AND accepted_at <= ?',
                               start_date.beginning_of_day,
                               end_date.end_of_day)
                           }

  has_many :changesets, dependent: :destroy
  has_many :tasks, dependent: :destroy

  has_attachments :documents,
                  accept: %i[raw jpg png psd docx xlsx doc xls pdf odt odm ods odg odp odb],
                  maximum: 10

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
                  ranked_by: ':trigram'

  JSON_ATTRIBUTES = %w[
    title release_date accepted_at created_at updated_at delivered_at description
    project_id story_type owned_by_id requested_by_id
    owned_by_name owned_by_initials requested_by_name estimate
    state position id labels
  ].freeze

  JSON_METHODS = %w[errors].freeze
  JSON_METHODS_WITH_DEPENDENCIES = %w[errors notes documents tasks].freeze

  def as_json(options = {})
    default_options = { only: JSON_ATTRIBUTES, methods: JSON_METHODS }
    super(default_options.merge(options))
  end

  def as_json_with_dependencies(options = {})
    as_json(**options, methods: JSON_METHODS_WITH_DEPENDENCIES)
  end

  def readonly?
    return false if destroyed_by_association
    !accepted_at_changed? && accepted_at.present?
  end

  # Set the project start date to today if the project start date is nil
  # and the state is changing to any state other than 'unstarted' or 'unscheduled'
  def fix_project_start_date
    return unless state_changed?
    return unless project && !project.start_date && !%w[unstarted unscheduled].include?(state)
    project.start_date = Date.current
  end

  # If a story's 'accepted at' date is prior to the project start date,
  # the project start date should be moved back accordingly
  def fix_story_accepted_at
    return unless accepted_at_changed? && accepted_at && accepted_at < project.start_date
    project.start_date = accepted_at
  end

  def release_date=(val)
    return if val.blank?

    date = Chronic.parse(val)
    self[:release_date] = date
  end
end
