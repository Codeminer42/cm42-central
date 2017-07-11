class ProjectEnrollerService
  include Pundit
  attr_reader :message

  def initialize(user, current_team, project, story)
    @user = user
    @current_team = current_team
    @project = project
    @story = story
  end

  def enroll
    return user_not_found unless @user
    return user_already_member if user_already_member?

    policy_scope(User) << @user
    @user.teams << @current_team
    @message = I18n.t('was added to this project', scope: 'users', email: @user.email)

    true
  end

  private

  def user_already_member?
    policy_scope(User).include?(@user) || @user.teams.include?(@current_team)
  end

  def user_not_found
    @message = I18n.t('teams.user_not_found')
    false
  end

  def user_already_member
    @message = I18n.t('is already a member of this project', scope: 'users', email: @user.email)
    false
  end

  def current_user
    @user
  end

  def pundit_user
    PunditContext.new(@current_team, @user, current_project: @project, current_story: @story)
  end
end
