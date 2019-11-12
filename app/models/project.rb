class Project < ApplicationRecord
  attr_writer :suppress_notifications

  POINT_SCALES = {
    'fibonacci' => [1, 2, 3, 5, 8].freeze,
    'powers_of_two' => [1, 2, 4, 8].freeze,
    'linear' => [1, 2, 3, 4, 5].freeze
  }.freeze

  ITERATION_LENGTH_RANGE = (1..4).freeze

  MAX_MEMBERS_PER_CARD = 4

  JSON_ATTRIBUTES = %w[
    id name iteration_length iteration_start_day start_date
    default_velocity
  ].freeze

  JSON_METHODS = %w[last_changeset_id point_values].freeze

  extend FriendlyId
  friendly_id :name, use: :slugged, reserved_words: %w[new edit].freeze

  belongs_to :tag_group

  has_attachment :import, accept: [:raw]

  has_many :integrations, dependent: :destroy
  has_many :changesets, dependent: :destroy
  has_many :integrations, dependent: :destroy
  has_many :ownerships
  has_many :teams, through: :ownerships
  has_many :memberships, dependent: :destroy
  has_many :users, -> { distinct }, through: :memberships
  has_many :stories, dependent: :destroy do
    def with_dependencies
      includes(:notes, :tasks, :document_files)
    end

    # Populates the stories collection from a CSV string.
    def from_csv(csv_string)
      # Eager load this so that we don't have to make multiple db calls when
      # searching for users by full name from the CSV.
      users = proxy_association.owner.users

      csv = ::CSV.parse(csv_string, headers: true)
      csv.map do |row|
        row_attrs = row.to_hash
        story = build(
          title: (row_attrs['Title'] || row_attrs['Story'] || '').truncate(255, omission: '...'),
          story_type: (row_attrs['Type'] || row_attrs['Story Type']).downcase,
          requested_by: users.detect { |u| u.name == row['Requested By'] },
          owned_by: users.detect { |u| u.name == row['Owned By'] },
          estimate: row_attrs['Estimate'],
          labels: row_attrs['Labels'],
          description: row_attrs['Description']
                      )

        story.requested_by_name = (row['Requested By'] || '').truncate(255)
        story.owned_by_name = (row['Owned By'] || '').truncate(255)
        story.owned_by_initials = (row['Owned By'] || '')
                                  .split(' ')
                                  .map { |n| n[0].upcase }
                                  .join('')

        tasks = []
        row.each_with_index do |(header, value), index|
          next if value.blank?

          case header
          when 'Document'
            story.documents << ::Attachinary::File.new(JSON.parse(value))
          when 'Task'
            next_value = row[index + 1].presence
            next if next_value.blank?

            tasks.unshift(Task.new(name: value, done: next_value == 'completed'))
          end
        end
        story.project.suppress_notifications = true # otherwise the import will generate massive notifications!
        story.tasks = tasks
        story.notes.from_csv_row(row)
        story.save

        row_state = (row_attrs['Current State'] || 'unstarted').downcase
        story.state = row_state if Story.available_states.include?(row_state.to_sym)
        story.accepted_at = row_attrs['Accepted at']
        story.save
        story
      end
    end
  end

  scope :joinable, -> { where(disallow_join: false) }
  scope :joinable_except, ->(project_ids) { joinable.where.not(id: project_ids) }
  scope :joined_by_team, ->(team) { joins(:teams).preload(:tag_group).where(teams: { id: team }) }

  accepts_nested_attributes_for :users, reject_if: :all_blank
  # These are the valid point scales for a project. These represent
  # the set of valid points estimate values for a story in this project.

  validates :point_scale, inclusion: { in: POINT_SCALES.keys,
                                       message: '%{value} is not a valid estimation scheme' }

  validates :iteration_length,
    numericality: { greater_than_or_equal_to: ITERATION_LENGTH_RANGE.min,
                    less_than_or_equal_to: ITERATION_LENGTH_RANGE.max, only_integer: true,
                    message: 'must be between 1 and 4 weeks' }

  validates :iteration_start_day,
    numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 6,
                    only_integer: true, message: 'must be an integer between 0 and 6' }

  validates :name, presence: true

  validates :default_velocity, numericality: { greater_than: 0,
                                               only_integer: true }

  scope :not_archived, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }

  def csv_filename
    "#{name}-#{Time.current.strftime('%Y%m%d_%I%M')}.csv"
  end

  scope :joined_by_team, ->(team) { joins(:teams).preload(:tag_group).where(teams: { id: team }) }

  def last_changeset_id
    changesets.last&.id
  end

  def as_json(options = {})
    super(**options, only: JSON_ATTRIBUTES, methods: JSON_METHODS)
  end

  def to_param
    ::FriendlyId::Disabler.disabled? ? (id&.to_s) : super
  end

  def suppress_notifications
    @suppress_notifications || false
  end

  def to_s
    name
  end

  def iteration_service(since: nil, current_time: Time.current)
    @iteration_service ||= Central::Support::IterationService.new(self, since: since, current_time: current_time)
  end

  def point_values
    POINT_SCALES[point_scale]
  end

  def archived
    !!archived_at
  end

  def archived=(value)
    self.archived_at = if !value || value == '0'
                         nil
                       else
                         Time.current
                       end
  end
end
