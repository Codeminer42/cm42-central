class Project < ApplicationRecord
  include Central::Support::ProjectConcern::Attributes
  include Central::Support::ProjectConcern::Associations
  include Central::Support::ProjectConcern::Validations
  include Central::Support::ProjectConcern::Scopes
  include Central::Support::ProjectConcern::CSV::InstanceMethods

  extend FriendlyId
  friendly_id :name, use: :slugged, reserved_words: %w[new edit].freeze

  MAX_MEMBERS_PER_CARD = 4

  JSON_ATTRIBUTES = %w[
    id name iteration_length iteration_start_day start_date
    default_velocity
  ].freeze

  JSON_METHODS = %w[last_changeset_id point_values].freeze

  belongs_to :tag_group

  has_many :integrations, dependent: :destroy

  has_many :changesets, dependent: :destroy

  has_attachment :import, accept: [:raw]

  scope :joinable, -> { where(disallow_join: false) }

  scope :joinable_except, ->(project_ids) { joinable.where.not(id: project_ids) }

  scope :joined_by_team, ->(team) { joins(:teams).preload(:tag_group).where(teams: { id: team }) }

  def last_changeset_id
    changesets.last && changesets.last.id
  end

  def as_json(options = {})
    super(**options, only: JSON_ATTRIBUTES, methods: JSON_METHODS)
  end

  def to_param
    ::FriendlyId::Disabler.disabled? ? (id && id.to_s) : super
  end
end
