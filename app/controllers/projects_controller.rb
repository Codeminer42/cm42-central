class ProjectsController < ApplicationController
  before_action :set_project, only: %i(show edit update destroy import import_upload
                                       reports ownership archive unarchive
                                       change_archived projects_unjoined)
  before_action :prepare_session, only: %i(import import_upload)
  before_action -> { define_sidebar :project_settings }, only: %i(import edit)
  before_action :set_story_flow, only: %i(show)
  before_action :fluid_layout, only: %i(show edit import)

  # GET /projects
  # GET /projects.xml
  def index
    @projects = {}

    projects_joined = policy_scope(Project)

    @projects = {
      joined: serialize_from_collection(projects_joined),
      unjoined: serialize_from_collection(projects_unjoined.order(:updated_at))
    }

    @activities_group = Activity.grouped_activities(projects_joined, 1.week.ago)
  end

  # GET /projects/1
  # GET /projects/1.xml
  def show
    @story = @project.stories.build

    respond_to do |format|
      format.html # show.html.erb
      format.js   { render json: @project }
      format.xml  { render xml: @project }
    end
  end

  # GET /projects/new
  # GET /projects/new.xml
  def new
    @project = policy_scope(Project).new
    authorize @project

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render xml: @project }
    end
  end

  # GET /projects/1/edit
  def edit
    @project.users.build
    authorize @project
  end

  # POST /projects
  # POST /projects.xml
  def create
    @project = policy_scope(Project).new(allowed_params)
    authorize @project
    @project.users << current_user

    respond_to do |format|
      if ProjectOperations::Create.call(@project, current_user)
        current_team.ownerships.create(project: @project, is_owner: true)
        format.html do
          redirect_to(@project, notice: t('projects.project was successfully created'))
        end
        format.xml { render xml: @project, status: :created, location: @project }
      else
        format.html { render action: 'new' }
        format.xml  { render xml: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /projects/1
  # PUT /projects/1.xml
  def update
    respond_to do |format|
      if ProjectOperations::Update.call(@project, allowed_params, current_user)
        format.html do
          redirect_to(@project, notice: t('projects.project was successfully updated'))
        end
        format.xml { head :ok }
      else
        format.html { render action: 'edit' }
        format.xml  { render xml: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /projects/1
  # DELETE /projects/1.xml
  def destroy
    ProjectOperations::Destroy.call(@project, current_user)

    respond_to do |format|
      format.html { redirect_to(projects_url) }
      format.xml  { head :ok }
    end
  end

  def join
    project = projects_unjoined.find_by!(slug: params[:id])
    authorize project

    project.users << current_user

    respond_to do |format|
      format.html do
        redirect_to(
          project,
          notice: I18n.t('was added to this project', scope: 'users', email: current_user.email)
        )
      end
      format.xml { render xml: project, status: :created, location: project }
    end
  end

  # CSV import form
  def import
    @import_job = session[:import_job]
    if @import_job.present?
      job_result = Rails.cache.read(@import_job[:id])

      if job_result
        session[:import_job] = nil
        if job_result[:errors]
          flash[:alert] = "Unable to import CSV: #{job_result[:errors]}"
        else
          @valid_stories    = @project.stories
          @invalid_stories  = job_result[:invalid_stories]
          flash[:notice] = I18n.t(
            'imported n stories', count: @valid_stories.count
          )

          unless @invalid_stories.empty?
            flash[:alert] = I18n.t(
              'n stories failed to import', count: @invalid_stories.count
            )
          end
        end
      else
        minutes_ago = (Time.current - @import_job[:created_at].to_datetime) / 1.minute
        session[:import_job] = nil if minutes_ago > 60
      end
    end
  end

  # CSV import
  def import_upload
    if params[:project][:import].blank?
      flash[:alert] = I18n.t('projects.uploads.select_file')
    else
      session[:import_job] = { id: ImportWorker.new_job_id, created_at: Time.current }

      @project.update_attributes(allowed_params)
      ImportWorker.perform_async(session[:import_job][:id], params[:id])

      flash[:notice] = I18n.t('projects.uploads.being_processed')
    end

    redirect_to [:import, @project]
  end

  def reports
    since = params[:since].nil? ? nil : params[:since].to_i.months.ago
    @service = IterationService.new(@project, since: since)
  end

  def ownership
    team = Team.not_archived.friendly.find(params.dig(:project, :slug))
    if team == current_team
      flash[:notice] = I18n.t('projects.invalid_action')
      render 'edit'
      return
    end

    case params.dig(:ownership_action)
    when 'share'
      team.ownerships.create(project: @project, is_owner: false)
      flash[:notice] = I18n.t('projects.project was successfully shared')
    when 'unshare'
      team.ownerships.where(project: @project).delete_all
      flash[:notice] = I18n.t('projects.project was successfully unshared')
    when 'transfer'
      Project.transaction do
        team_admin = team.enrollments.where(is_admin: true).first.try(:user)
        raise ActiveRecord::RecordNotFound, 'Team Administrator not found' unless team_admin

        current_team.ownerships.where(project: @project).delete_all
        @project.memberships.delete_all
        @project.users << team_admin
        team.ownerships.create(project: @project, is_owner: true)
      end
      flash[:notice] = I18n.t('projects.project was successfully transferred')
      redirect_to root_path
      return
    else
      flash[:alert] = I18n.t('projects.invalid_action')
    end

    redirect_to edit_project_path(@project)
  end

  def archived
    @projects = policy_scope(Project).archived
    authorize @projects
  end

  def archive
    change_archived true
  end

  def unarchive
    change_archived false
  end

  protected

  def change_archived(archive = true)
    @project = policy_scope(Project).archived.friendly.find(params[:id]) unless @project
    authorize @project

    respond_to do |format|
      @project = ProjectOperations::Update.call(
        @project,
        { archived: archive ? Time.current : '0' },
        current_user
      )

      if @project
        format.html do
          redirect_to(
            @project,
            notice: t("projects.project was successfully #{archive ? 'archived' : 'unarchived'}")
          )
        end
        format.xml { head :ok }
      else
        format.html { render action: 'edit' }
        format.xml  { render xml: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  def set_story_flow
    @story_flow = {
      current: cookies[:current_flow],
      default: Fulcrum::Application.config.fulcrum.column_order
    }
  end

  def allowed_params
    params
      .fetch(:project)
      .permit(:name, :point_scale, :default_velocity, :tag_group_id, :start_date,
              :iteration_start_day, :iteration_length, :import, :archived, :disallow_join)
  end

  def fluid_layout
    @layout_settings[:fluid] = true
  end

  def set_project
    @project = policy_scope(Project).friendly.find(params[:id])
    authorize @project
  end

  def prepare_session
    session[:import_job] = (session[:import_job] || {}).with_indifferent_access
  end

  private

  def projects_unjoined
    current_team.projects.not_archived.joinable_except(policy_scope(Project))
  end

  def serialize_from_collection(collection)
    ProjectSerializer.from_collection(ProjectPresenter.from_collection(collection))
  end
end
