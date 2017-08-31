class UsersController < ApplicationController
  before_action :set_project

  respond_to :html, :json

  def index
    @user = User.new
    @current_team_users = current_team_users
    respond_with(@project.users)
  end

  def create
    user_params = allowed_params.merge(was_created: true)
    @user = User.create_with(user_params).find_or_create_by(email: user_params[:email])
    @current_team_users = current_team_users

    authorize @user

    if @user.persisted? || @user.save
      if policy_scope(User).include?(@user)
        flash[:alert] = t 'is already a member of this project', scope: 'users', email: @user.email
      else
        policy_scope(User) << @user
        @user.teams << current_team unless @user.teams.include?(current_team)
        action = @user.was_created ? 'sent an invite to join' : 'added to'
        flash[:notice] = t "was #{action} this project", scope: 'users', email: @user.email
      end

      respond_to do |format|
        format.js { render :refresh_user_list }
        format.html { redirect_to project_users_url(@project) }
      end
    else
      render 'index'
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
    params.require(:user).permit(:email, :name, :initials, :username)
  end

  def set_project
    @project = policy_scope(Project).friendly.find(params[:project_id])
  end
end
