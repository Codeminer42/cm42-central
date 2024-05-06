class MembershipsController < ApplicationController
  before_action :set_project

  def create
    authorize available_users
    if enroll
      flash.notice = @project_enroller_service.message
    else
      flash.alert = @project_enroller_service.message
    end

    respond_to do |format|
      format.js { render 'users/refresh_user_list' }
      format.html { redirect_to project_users_url(@project) }
    end
  end

  private

  def available_users
    User.where.not(id: @project.users).order(:name)
  end

  def allowed_params
    params.require(:user).permit(:email)
  end

  def set_project
    @project = policy_scope(Project).friendly.find(params[:project_id])
  end

  def enroll
    @user = User.find_by(email: allowed_params[:email])
    @project_enroller_service = ProjectMembershipEnrollerService.new(@user, @project)
    if @project_enroller_service.enroll
      authorize @user
      @available_users = available_users
      true
    else
      false
    end
  end
end
