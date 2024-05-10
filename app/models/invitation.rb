class Invitation
  include ActiveModel::Model

  attr_accessor :project, :email, :name, :initials, :username, :role

  def save
    user = User.create({
      email:,
      name:,
      initials:,
      username:,
      role:,
    })
    MembershipOperations::Create.call(
      project:,
      user:,
    )
  end
end
