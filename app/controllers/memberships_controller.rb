class MembershipsController < ApplicationController
  before_action :set_project

  def create
    authorize available_users
    if @user = User.find_by(email: params[:email])
      result = MembershipOperations::Create.call(
        project: @project,
        user: @user,
      )
      if result.success?
        flash.notice = I18n.t('was added to this project', scope: 'users', email: @user.email)
      else
        flash.alert = I18n.t('is already a member of this project', scope: 'users', email: @user.email)
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
end
