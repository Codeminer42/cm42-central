class Team < ApplicationRecord
  DOMAIN_SEPARATORS_REGEX = /[,;\|\n]/.freeze

  has_many :api_tokens
  has_many :tag_groups
  has_many :enrollments
  has_many :users, through: :enrollments
  has_many :ownerships
  has_many :projects, through: :ownerships do
    def not_archived
      where(archived_at: nil)
    end
  end

  validates :name, presence: true, uniqueness: true

  scope :not_archived, -> { where(archived_at: nil) }
  scope :archived, -> { where.not(archived_at: nil) }
  scope :ordered_by_name, -> { order(:name) }

  extend FriendlyId
  friendly_id :name, use: :slugged, reserved_words: %w[new edit].freeze

  has_attachment :logo, accept: %i[jpg png gif bmp]

  def to_param
    ::FriendlyId::Disabler.disabled? ? (id&.to_s) : super
  end

  def is_admin?(user)
    enrollments.find_by_user_id(user.id)&.is_admin?
  end

  def owns?(project)
    ownerships.find_by_project_id(project.id)&.is_owner
  end
end
