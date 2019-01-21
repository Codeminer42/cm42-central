class UsersController < ApplicationController
  before_action :set_project, except: :create

  respond_to :html, :json

  def index
    @user = User.new
    @current_team_users = current_team_users
    respond_with(@project.users)
  end

  def create
    build_user
    if @user.save
      @user.teams << current_team unless @user.teams.include?(current_team)
      flash[:notice] = I18n.t('was added to the team', scope: 'users', email: @user.email)
    else
      flash[:alert] = I18n.t('was not created', scope: 'users', email: @user.email)
    end

    respond_to do |format|
      format.js { render :refresh_user_list }
      format.html { redirect_back fallback_location: root_path }
    end
  end

  def destroy
    @user = policy_scope(User).find(params[:id])
    authorize @user
    @current_team_users = current_team_users

    ActiveRecord::Base.transaction do
      RemoveStoriesFromUserService.call(@user, @project)
      policy_scope(User).delete(@user)
    end

    flash[:notice] = I18n.t('was removed from this project', scope: 'users', email: @user.email)

    respond_to do |format|
      format.js { render :refresh_user_list }
      format.html { redirect_back fallback_location: root_path }
    end
  end

  private

  def current_team_users
    current_team.users.where.not(id: @project.users).order(:name)
  end

  def allowed_params
    params.require(:user).permit(:email, :name, :initials, :username)
  end

  def set_project
    @project = policy_scope(Project).friendly.find(params[:project_id])
  end

  def build_user
    @user = User.new(
      email: allowed_params[:email],
      name: allowed_params[:name],
      initials: allowed_params[:initials],
      username: allowed_params[:username]
    )
    authorize @user
  end
end
