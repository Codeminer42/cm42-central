class MembershipsController < ApplicationController
  before_action :set_project

  def create
    authorize current_team_users

    @user = User.find_by(email: allowed_params[:email])

    project_enroller_service = ProjectMembershipEnrollerService.new(@user, current_team, @project)

    if project_enroller_service.enroll
      authorize @user
      @current_team_users = current_team_users

      flash[:notice] = project_enroller_service.message
    else
      flash[:alert] = project_enroller_service.message
    end

    respond_to do |format|
      format.js { render 'users/refresh_user_list' }
      format.html { redirect_to project_users_url(@project) }
    end
  end

  private

  def current_team_users
    current_team.users.where.not(id: @project.users).order(:name)
  end

  def allowed_params
    params.require(:user).permit(:email)
  end

  def set_project
    @project = policy_scope(Project).friendly.find(params[:project_id])
  end
end
