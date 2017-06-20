class UsersController < ApplicationController
  before_action :set_project, except: :create

  respond_to :html, :json

  def index
    @user = User.new
    @current_team_users = current_team_users
    respond_with(@project.users)
  end

  def create
    @user = User.new(
      email: allowed_params[:email],
      name: allowed_params[:name],
      initials: allowed_params[:initials],
      username: allowed_params[:username])
    authorize @user

    if @user.save
      @user.teams << current_team unless @user.teams.include?(current_team)
      flash[:notice] = I18n.t('was added to the team', scope: 'users', email: @user.email)
    else
      flash[:alert] = I18n.t('was not created', scope: 'users', email: @user.email)
    end

    respond_to do |format|
      format.js { render :refresh_user_list }
      format.html { redirect_to :back }
    end
  end

  def destroy
    @user = policy_scope(User).find(params[:id])
    authorize @user
    @current_team_users = current_team_users
    policy_scope(User).delete(@user)
    flash[:notice] = I18n.t('was removed from this project', scope: 'users', email: @user.email)

    respond_to do |format|
      format.js { render :refresh_user_list }
      format.html { redirect_to :back }
    end
  end

  private

  def current_team_users
    current_team.users.where.not(id: @project.users).order(:name)
  end

  def allowed_params
    params.require(:user).permit(:email, :name, :initials, :username, :locale, :time_zone, :role)
  end

  def set_project
    @project = policy_scope(Project).friendly.find(params[:project_id])
  end
end
