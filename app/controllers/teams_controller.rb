class TeamsController < ApplicationController
  skip_before_action :check_team_presence, only: %i[index switch new create unarchive]
  skip_after_action :verify_policy_scoped, only: :index

  def index
    @teams = current_user.teams
    authorize @teams
  end

  def switch
    team = current_user.teams.friendly.find(params[:team_slug])
    authorize team
    session[:current_team_slug] = team.slug
    redirect_to root_path
  end

  def manage_users
    team = current_user.teams.friendly.find params[:team_id]
    authorize team
    @users = team.users.order(:name).map do |user|
      Admin::UserPresenter.new(user)
    end
  end

  def new_enrollment
    authorize current_team
    @user = User.new
  end

  def create_enrollment
    user = User.find_by(email: params[:user][:email])
    if user
      authorize user
      if user.teams.include?(current_team)
        flash[:notice] = t('teams.user_is_already_in_this_team')
      else
        user.teams << current_team
        user.save
        flash[:notice] = t('teams.team_was_successfully_updated')
      end
    else
      authorize current_team
      flash[:notice] = t('teams.user_not_found')
    end
    redirect_to team_new_enrollment_path
  end

  def new
    @team = Team.new
    authorize @team
  end

  def edit
    @team = current_team
    @user_teams = current_user.teams.not_archived.ordered_by_name
    authorize @team
  end

  def create
    @team = Team.new(allowed_params)
    authorize @team

    result = TeamOperations::Create.call(team: @team, current_user: current_user)

    match_result(result) do |on|
      on.success do |team|
        session[:current_team_slug] = team.slug
        flash[:notice] = t('teams.team was successfully created')
        redirect_to(root_path)
      end

      on.failure do
        render action: 'new'
      end
    end
  end

  def update
    @team = current_team
    authorize @team

    result = TeamOperations::Update.call(
      team: @team,
      team_attrs: allowed_params,
      current_user: current_user
    )

    if result.success?
      redirect_to [:edit, @team], notice: t('teams.team_was_successfully_updated')
    else
      render action: 'edit'
    end
  end

  def destroy
    @team = current_team
    authorize @team

    TeamOperations::Destroy.call(team: @team, current_user: current_user)
    session[:current_team_slug] = nil if @team.slug == session[:current_team_slug]
    Notifications.archived_team(@team).deliver_later if params[:send_email]

    redirect_to :teams, notice: t('teams.successfully_archived')
  end

  def unarchive
    archived_team = Team.find_by(id: params[:id])
    authorize archived_team, :update?

    TeamOperations::Unarchive.call(team: archived_team)

    redirect_to :teams, notice: t('teams.successfully_unarchived')
  end

  protected

  def allowed_params
    params.require(:team).permit(
      :name, :disable_registration, :registration_domain_whitelist,
      :registration_domain_blacklist, :logo
    )
  end
end
