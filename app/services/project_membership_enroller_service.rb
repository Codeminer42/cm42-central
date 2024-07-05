class ProjectMembershipEnrollerService
  include Pundit::Authorization
  attr_reader :message

  def initialize(user, current_team, project)
    @user = user
    @current_team = current_team
    @project = project
  end

  def enroll
    return user_not_found unless user_exists?
    return user_already_member if user_already_member?

    @current_team.users << @user unless @user.teams.include?(@current_team)
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
    @message = I18n.t('teams.user_not_found')
    false
  end

  def user_already_member
    @message = I18n.t('is already a member of this project', scope: 'users', email: @user.email)
    false
  end

  def pundit_user
    PunditContext.new(@current_team, @user, current_project: @project)
  end
end
