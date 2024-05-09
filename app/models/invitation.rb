class Invitation
  include ActiveModel::Model

  attr_accessor :project, :email, :name, :initials, :username, :role

  def save
    project.users.create({
      email:,
      name:,
      initials:,
      username:,
      role:,
    })
  end
end
