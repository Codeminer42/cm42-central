class User < ApplicationRecord
  # Flag used to identify if the user was found or created from find_or_create
  attr_accessor :was_created
  attr_accessor :team_slug

  JSON_ATTRIBUTES = %w[id name initials username email finished_tour].freeze
  AUTHENTICATION_KEYS = %i[email].freeze
  ROLES = %w[manager developer guest].freeze

  before_validation :set_random_password_if_blank

  after_save :set_team

  before_destroy :remove_story_association

  has_many :enrollments
  has_many :teams, through: :enrollments
  has_many :memberships, dependent: :destroy
  has_many :projects, -> { distinct }, through: :memberships do
    def not_archived
      where(archived_at: nil)
    end
  end

  validates :name, :username, :initials, presence: true
  validates :username, uniqueness: true

  extend Enumerize
  extend ActiveModel::Naming
  enumerize :role, in: ROLES

  include Gravtastic
  gravtastic default: 'identicon'

  # FIXME: - DRY up, repeated in Story model
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :authy_authenticatable, :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable,
         authentication_keys: AUTHENTICATION_KEYS,
         strip_whitespace_keys: AUTHENTICATION_KEYS,
         confirmation_keys: AUTHENTICATION_KEYS,
         reset_password_keys: AUTHENTICATION_KEYS
  # unlock_keys: AUTHENTICATION_KEYS

  scope :recently_created, lambda { |created_at|
    where('users.created_at > ?', created_at) if created_at
  }

  def password_required?
    # Password is required if it is being set, but not for new records
    if !persisted?
      false
    else
      !password.nil? || !password_confirmation.nil?
    end
  end

  def guest?
    role == 'guest'
  end

  def to_s
    "#{name} (#{initials}) <#{email}>"
  end

  # Sets :reset_password_token encrypted by Devise
  # returns the raw token to pass into mailer
  def set_reset_password_token
    raw, enc = Devise.token_generator.generate(self.class, :reset_password_token)
    self.reset_password_token   = enc
    self.reset_password_sent_at = Time.current.utc
    save(validate: false)
    raw
  end

  def tour_steps
    WelcomeTour::STEPS.to_json
  end

  def as_json(options = {})
    super(**options, only: JSON_ATTRIBUTES, methods: %i[tour_steps guest?])
  end

  def self.find_first_by_auth_conditions(warden_conditions)
    if warden_conditions[:reset_password_token]
      find_by(reset_password_token: warden_conditions[:reset_password_token])
    elsif warden_conditions[:confirmation_token]
      find_by(confirmation_token: warden_conditions[:confirmation_token])
    else
      find_by(email: warden_conditions[:email])
    end
  end

  def requested?(story)
    story.requested_by_id == id
  end

  def owns?(story)
    story.owned_by_id == id
  end

  def team_from_project(project)
    user_team_ids = teams.pluck(:id)
    project.teams.find_by(id: user_team_ids)
  end

  def set_random_password_if_blank
    if new_record? && password.blank? && password_confirmation.blank?
      self.password = self.password_confirmation = Digest::SHA1.hexdigest(
        "--#{Time.current}--#{email}--"
      )[0, 8]
    end
  end

  def set_team
    if team_slug
      team = Team.not_archived.find_by(slug: team_slug)
      enrollments.create(team: team) if team
    end
  end

  def remove_story_association
    Story.where(requested_by_id: id).update_all(requested_by_id: nil, requested_by_name: nil)
    Story.where(owned_by_id: id).update_all(owned_by_id: nil, owned_by_name: nil)
    Membership.where(user_id: id).delete_all
  end

  def early_v2_user?
    ENV['EARLY_V2_EMAIL'] && email.include?(ENV['EARLY_V2_EMAIL'])
  end
end
