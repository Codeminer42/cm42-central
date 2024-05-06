class ProjectMembershipEnrollerService
  include Pundit::Authorization
  attr_reader :message

  def initialize(user, project)
    @user = user
    @project = project
  end

  def enroll
    return user_not_found unless user_exists?
    return user_already_member if user_already_member?

    @project.users << @user
    @message = I18n.t('was added to this project', scope: 'users', email: @user.email)

    true
  end

  private

  def user_exists?
    @user.present?
  end

  def user_already_member?
    policy_scope(User).include?(@user)
  end

  def user_not_found
    @message = "User not found"
    false
  end

  def user_already_member
    @message = I18n.t('is already a member of this project', scope: 'users', email: @user.email)
    false
  end

  def pundit_user
    PunditContext.new(@project, @user)
  end
end
