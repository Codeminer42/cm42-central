class TeamsController < ApplicationController
  skip_before_action :check_team_presence, only: %i[index switch new create]
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
      add_team_for(user)
    else
      authorize current_team
      flash[:notice] = t('teams.user_not_found')
    end
    redirect_to team_new_enrollment_path
  end

  # GET /teams/new
  # GET /teams/new.xml
  def new
    @team = Team.new
    authorize @team
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render xml: @team }
    end
  end

  # GET /teams/1/edit
  def edit
    @team = current_team
    @user_teams = current_user.teams.not_archived.order(:name)

    authorize @team
  end

  # POST /teams
  # POST /teams.xml
  def create
    @team = Team.new(allowed_params)
    authorize @team
    respond_to do |format|
      if can_create?
        format.html do
          session[:current_team_slug] = @team.slug
          flash[:notice] = t('teams.team was successfully created')
          redirect_to(root_path)
        end
        format.xml  { render xml: @team, status: :created, location: @team }
      else
        format.html { render action: 'new' }
        format.xml  { render xml: @team.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /teams/1
  # PUT /teams/1.xml
  def update
    @team = current_team
    authorize @team

    respond_to do |format|
      if TeamOperations::Update.call(@team, allowed_params, current_user)
        @team.reload

        format.html do
          flash[:notice] = t('teams.team_was_successfully_updated')
          render action: 'edit'
        end
        format.xml  { head :ok }
      else
        format.html { render action: 'edit' }
        format.xml  { render xml: @team.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /teams/1
  # DELETE /teams/1.xml
  def destroy
    @team = current_team
    authorize @team

    TeamOperations::Destroy.call(@team, current_user)
    session[:current_team_slug] = nil

    respond_to do |format|
      format.html do
        flash[:notice] = t('teams.successfully_archived')
        redirect_to root_path
      end
      format.xml  { head :ok }
    end
  end

  def unarchiving
    archived_team = Team.find_by(id: params[:id])
    authorize archived_team, :update?
    unarchived_team = TeamOperations::Unarchive.call(archived_team)

    respond_to do |format|
      if unarchived_team
        format.html do
          flash[:notice] = t('teams.successfully_unarchived')
          redirect_to teams_path
        end
      end
    end
  end

  protected

  def allowed_params
    params.require(:team).permit(
      :name, :disable_registration, :registration_domain_whitelist,
      :registration_domain_blacklist, :logo
    )
  end

  def can_create?
    check_recaptcha && (@team = TeamOperations::Create.call(@team, current_user))
  end

  def add_team_for(user)
    if user.teams.include?(current_team)
      flash[:notice] = t('teams.user_is_already_in_this_team')
    else
      user.teams << current_team
      user.save
      flash[:notice] = t('teams.team_was_successfully_updated')
    end
  end

  def check_recaptcha
    return true unless show_recaptcha?

    verify_recaptcha
  end
end
