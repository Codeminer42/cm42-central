class Story < ApplicationRecord
  include ActiveModel::Transitions
  extend Enumerize

  before_save :set_started_at
  before_save :set_accepted_at
  before_save :set_delivered_at
  before_save :cache_user_names

  positioned on: [:project, :positioning_column]
  before_save { |record| record.positioning_column = record.calculate_positioning_column }
  def calculate_positioning_column
    if column == "#backlog"
      "#in_progress"
    else
      column
    end
  end

  def saved_changes
    super.select do |key, value|
      value.uniq.length > 1
    end
  end

  scope :not_accepted, -> { where(accepted_at: nil) }
  scope :accepted,    -> { where(state: 'accepted').where.not(accepted_at: nil) }
  scope :done,        -> { where(state: :accepted) }
  scope :in_progress, -> { where(state: [:started, :finished, :delivered]) }
  scope :backlog,     -> { where(state: :unstarted) }
  scope :chilly_bin,  -> { where(state: :unscheduled) }
  scope :accepted_between, lambda { |start_date, end_date|
                             where('accepted_at >= ? AND accepted_at <= ?',
                               start_date.beginning_of_day,
                               end_date.end_of_day)
                           }

  delegate :suppress_notifications, to: :project

  belongs_to :project, counter_cache: true, touch: true
  belongs_to :requested_by, class_name: 'User'
  belongs_to :owned_by, class_name: 'User'

  has_many :users, through: :project
  has_many :changesets, dependent: :destroy
  has_many :tasks, dependent: :destroy
  has_many :notes, -> { order(:created_at) }, dependent: :destroy

  serialize :blockers, type: Array, coder: JSON

  accepts_nested_attributes_for :tasks, :notes, reject_if: proc { |attributes| attributes[:note].blank? }

  attr_accessor :acting_user, :base_uri
  attr_accessor :iteration_number, :iteration_start_date # helper fields for IterationService
  attr_accessor :iteration_service

  # include PgSearch::Model
  # pg_search_scope :search,
  #                 against: {
  #                   title: 'A',
  #                   description: 'B',
  #                   labels: 'C'
  #                 },
  #                 using: {
  #                   tsearch: {
  #                     prefix: true,
  #                     negation: true
  #                   }
  #                 }

  # pg_search_scope :search_labels,
  #                 against: :labels,
  #                 ranked_by: ':trigram'

  ESTIMABLE_TYPES = %w[feature].freeze
  STORY_TYPES     = %i[feature chore bug release].freeze

  enumerize :story_type, in: STORY_TYPES, predicates: true, scope: true
  validates :project, presence: true
  validates :title, presence: true
  validates :requested_by_id, user_belongs_to_project: true
  validates :owned_by_id, user_belongs_to_project: true
  validates :story_type, presence: true
  validates :estimate, central_estimate: true, allow_nil: true
  validate :validate_non_estimable_story

  state_machine do
    state :unscheduled
    state :unstarted
    state :started
    state :finished
    state :delivered
    state :accepted
    state :rejected

    event :start do
      transitions to: :started, from: %i[unstarted unscheduled]
    end

    event :finish do
      transitions to: :finished, from: :started
    end

    event :deliver do
      transitions to: :delivered, from: :finished
    end

    event :accept do
      transitions to: :accepted, from: :delivered
    end

    event :reject do
      transitions to: :rejected, from: :delivered
    end

    event :restart do
      transitions to: :started, from: :rejected
    end
  end

  def states
    self.class.state_machine.states.map(&:name)
  end

  def events
    self.class.state_machine.events_for(current_state)
  end

  def column
    case state
    when 'unscheduled'
      '#chilly_bin'
    when 'unstarted'
      '#backlog'
    when 'accepted'
      if iteration_service
        if iteration_service.current_iteration_number == iteration_service.iteration_number_for_date(accepted_at)
          return '#in_progress'
        end
      end
      '#done'
    else
      '#in_progress'
    end
  end

  def stakeholders_users
    ([requested_by, owned_by] + notes.map(&:user)).compact.uniq
  end

  def to_s
    title
  end

  # Set the project start date to today if the project start date is nil
  # and the state is changing to any state other than 'unstarted' or 'unscheduled'
  def fix_project_start_date
    return unless state_previously_changed?
    return unless project && !project.start_date && !%w[unstarted unscheduled].include?(state)
    project.start_date = Date.current
  end

  # If a story's 'accepted at' date is prior to the project start date,
  # the project start date should be moved back accordingly
  def fix_story_accepted_at
    return unless accepted_at_previously_changed? && accepted_at && accepted_at < project.start_date
    project.start_date = accepted_at
  end

  def cycle_time_in(unit = :days)
    raise 'wrong unit' unless %i[days weeks months years].include?(unit)
    (cycle_time / 1.send(unit)).round
  end

  def set_started_at
    return unless state_changed?
    return unless state == 'started'
    self.started_at = Time.current if started_at.nil?
    self.owned_by = acting_user if owned_by.nil? && acting_user
  end

  def set_accepted_at
    return unless state_changed?
    return unless state == 'accepted'
    self.accepted_at = Time.current if accepted_at.nil?
    self.cycle_time = accepted_at - started_at if started_at
  end

  def set_delivered_at
    return unless state_changed?
    return unless state == 'delivered'
    self.delivered_at = Time.current if delivered_at.nil?
  end

  def cache_user_names
    self.requested_by_name = requested_by&.name
    self.owned_by_name     = owned_by&.name
    self.owned_by_initials = owned_by&.initials
  end

  def self.can_be_estimated?(story_type)
    ESTIMABLE_TYPES.include?(story_type.to_s)
  end

  def estimated?
    estimate.present?
  end

  # Returns true if this story can have an estimate made against it
  def estimable_type?
    ESTIMABLE_TYPES.include? story_type
  end

  private

  def validate_non_estimable_story
    errors.add(:estimate, :cant_estimate) if !estimable_type? && estimated?
  end
end
