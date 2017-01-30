class User < ActiveRecord::Base
  before_create :set_tour_steps

  include Central::Support::UserConcern::Associations
  include Central::Support::UserConcern::Validations
  include Central::Support::UserConcern::Callbacks

  include Gravtastic
  gravtastic default: 'identicon'

  # FIXME - DRY up, repeated in Story model
  JSON_ATTRIBUTES = ["id", "name", "initials", "username", "email", "tour", "tour_steps"]
  TOUR_STEPS = [
    {
      title: "Create team",
      text: 'You must create a new Team to start, you will become the administrator of the Team. Teams can have many members and many projects and you can participate in multiple teams at the same time',
      attachTo: '.step-create-team bottom',
      done: false
    },
    {
      title: 'Create Project',
      text: 'You can create as many projects as you want clicking this button',
      attachTo: '.step-create-project bottom',
      done: false
    },
    {
      title: 'Project Activity',
      text: 'Every time you change something in the Project or its Story they will be audited and the details of the changes will be visible to every team member from this Activity timeline box. <br> <strong>Pro tip</strong>: you shouldn\'t change a Story after the team started working on it, you must add a new Story.',
      attachTo: '.step-activity bottom',
      done: false
    },
    {
      title: 'Create Story',
      text: 'Click this button to create new Stories. A Story can be the description of a new feature or a bug report, for example. New stories will be created first at the Chilly Bin box.',
      attachTo: '.step-add-story bottom',
      done: false
    },
    {
      title: 'Chilly bin',
      text: 'All new stories are stores in this Chilly Bin. You should describe your stories expecting that the description and attachments will suffice for the story to be implemented. Project members should estimate those stories.',
      attachTo: '.step-chilly-bin bottom',
      done: false
    },
    {
      title: 'Backlog',
      text: 'The backlog MUST have all stories by order of PRIORITY. Most valuable and ready-to-start stories at the top and optional or uncertain stories at the very bottom',
      attachTo: '.step-backlog bottom',
      done: false
    },
    {
      title: 'In Progress',
      text: 'This is where stories that must be worked on right now will reside. Central will automatically pick up the top stories from the Backlog to fit the team\'s current Velocity',
      attachTo: '.step-in-progress bottom',
      done: false
    },
    {
      title: 'Done',
      text: 'After a story is delivered and approved, it is sorted out at the bottom of this column. A delivered story can\'t be modified and this column is here to show you everything that has already been finished and approved',
      attachTo: '.step-done bottom',
      done: false
    },
    {
      title: 'Project Velocity',
      text: 'All stories are estimated by "points". The average of points delivered by a team during an Iteration is the Velocity. The estimated end date of a Project is the total amount of points in the Backlog divided by the Velocity. Here you can simulate adding a new member by slightly increasing the estimated Velocity to see the effects on the future Iteration dates',
      attachTo: '.step-velocity bottom',
      done: false
    },
    {
      title: 'Members',
      text: 'If you want to add or remove people from the Project team, click here',
      attachTo: '.step-members bottom',
      done: false
    }
  ]

  AUTHENTICATION_KEYS = %i(email)

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :authy_authenticatable, :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable,
         authentication_keys:   AUTHENTICATION_KEYS,
         strip_whitespace_keys: AUTHENTICATION_KEYS,
         confirmation_keys:     AUTHENTICATION_KEYS,
         reset_password_keys:   AUTHENTICATION_KEYS
         # unlock_keys: AUTHENTICATION_KEYS

  # Flag used to identify if the user was found or created from find_or_create
  attr_accessor :was_created

  scope :recently_created, -> (created_at) { where("users.created_at > ?", created_at) if created_at }
  
  def password_required?
    # Password is required if it is being set, but not for new records
    if !persisted?
      false
    else
      !password.nil? || !password_confirmation.nil?
    end
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
    self.save(validate: false)
    raw
  end

  def set_tour_steps
    self.tour_steps = TOUR_STEPS.to_json
  end

  def as_json(options = {})
    super(only: JSON_ATTRIBUTES)
  end

  def self.find_first_by_auth_conditions(warden_conditions)
    if warden_conditions[:reset_password_token]
      where(reset_password_token: warden_conditions[:reset_password_token]).first
    elsif warden_conditions[:confirmation_token]
      where(confirmation_token: warden_conditions[:confirmation_token]).first
    else
      find_by(email: warden_conditions[:email])
    end
  end
end
