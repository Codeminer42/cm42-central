class InvitationsController < ApplicationController
  before_action :set_project, except: [:show, :update]
  skip_before_action :authenticate_user!, only: :show
  skip_after_action :verify_authorized, only: :show

  def new
    @invitation = Invitation.new(project: @project, email: params[:email])
    authorize @invitation
  end

  def create
    @invitation = Invitation.new(invitation_params.merge(project: @project))
    authorize @invitation

    if @invitation.save
      redirect_to [@project, :users], notice: "#{@invitation.email} was invited to this project"
    else
      render :new
    end
  end

  def show
    @user = User.confirm_by_token(params[:id])
    if @user.valid? && @user.errors.empty?
      sign_out
      reset_token = @user.set_reset_password_token
      redirect_to edit_user_password_path(reset_password_token: reset_token),
        notice: "Welcome, #{@user.name}!"
    else
      redirect_to "/", alert: "Invalid invitation link. Please contact Michael or Micah for support."
    end
  end

  def update
    user = User.find(params[:id])
    authorize user
    user.send_confirmation_instructions
    flash.notice = "Invitation email sent to #{user.email}"
    redirect_back_or_to "/projects"
  end

  private

  def set_project
    @project = policy_scope(Project).friendly.find(params[:project_id])
  end

  def invitation_params
    params.require(:invitation).permit!
  end
end

