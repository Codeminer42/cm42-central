class MembershipsController < ApplicationController
  before_action :set_project

  def create
    authorize available_users
    if @user = User.find_by(email: params[:email])
      if enroll
        flash.notice = @project_enroller_service.message
      else
        flash.alert = @project_enroller_service.message
      end
      redirect_to project_users_url(@project)
    else
      redirect_to [:new, @project, :invitation, email: params[:email]]
    end
  end

  private

  def available_users
    User.where.not(id: @project.users).order(:name)
  end

  def set_project
    @project = policy_scope(Project).friendly.find(params[:project_id])
  end

  def enroll
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
