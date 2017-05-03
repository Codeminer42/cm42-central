class Project < ActiveRecord::Base
  include Central::Support::ProjectConcern::Attributes
  include Central::Support::ProjectConcern::Associations
  include Central::Support::ProjectConcern::Validations
  include Central::Support::ProjectConcern::Scopes
  include Central::Support::ProjectConcern::CSV::InstanceMethods

  extend FriendlyId
  friendly_id :name, use: :slugged

  MAX_MEMBERS_PER_CARD = 4

  JSON_ATTRIBUTES = [
    "id", "name" ,"iteration_length", "iteration_start_day", "start_date",
    "default_velocity"
  ].freeze

  JSON_METHODS = ["last_changeset_id", "point_values", "tag_group_attributes"].freeze

  belongs_to :tag_group

  has_many :changesets, dependent: :destroy

  has_attachment :import, accept: [:raw]

  scope :joinable, -> { where(disallow_join: false) }

  scope :joinable_except, -> (project_ids) { joinable.where.not(id: project_ids) }

  scope :related_projects, -> (project) { where(tag_group: project.tag_group).where.not(id: project.id) }

  def tag_group_attributes
    tag_group&.attributes
  end

  def last_changeset_id
    changesets.last && changesets.last.id
  end

  def as_json(options = {})
    super(only: JSON_ATTRIBUTES, methods: JSON_METHODS)
  end

  def to_param
    ::FriendlyId::Disabler.disabled? ? (id && id.to_s) : super
  end
end
