class ProjectsController < ApplicationController
  before_action :set_project, only: %i[show edit update destroy import import_upload
                                       reports archive unarchive]
  before_action :prepare_session, only: %i[import import_upload]
  before_action -> { define_sidebar :project_settings }, only: %i[import edit]
  before_action :set_story_flow, only: %i[show]
  before_action :fluid_layout, only: %i[show edit import]

  def index
    @projects = {}

    @projects = policy_scope(Project).preload(:tag_group) # map ProjectPresenter.from_collection(collection)

    @activities_group = Activity.grouped_activities(@projects, 1.week.ago)

    redirect_to @projects.first if @projects.size == 1
  end

  def show
    @story = @project.stories.build
    session[:current_project_slug] = @project.slug
  end

  def new
    @project = policy_scope(Project).new
    authorize @project
  end

  def edit
    @project.users.build
    authorize @project
  end

  def create
    @project = policy_scope(Project).new(allowed_params)
    authorize @project
    @project.users << current_user

    result = ProjectOperations::Create.call(
      project: @project,
      current_user: current_user,
    )

    match_result(result) do |on|
      on.success do |project|
        redirect_to(project, notice: t('projects.project was successfully created'))
      end
      on.failure do |project|
        render action: 'new'
      end
    end
  end

  def update
    result = ProjectOperations::Update.call(
      project: @project,
      project_attrs: allowed_params,
      current_user: current_user
    )

    if result.success?
      redirect_to(@project, notice: t('projects.project was successfully updated'))
    else
      render action: 'edit'
    end
  end

  def destroy
    if valid_name_confirmation?
      ProjectOperations::Destroy.call(project: @project, current_user: current_user)

      redirect_to(projects_url)
    else
      redirect_to(edit_project_path, alert: t('projects.confirmation_invalid'))
    end
  end

  # CSV import form
  def import
    @import_job = session[:import_job]
    return if @import_job.blank?

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

  # CSV import
  def import_upload
    if params[:project].blank?
      flash[:alert] = I18n.t('projects.uploads.select_file')
    else
      session[:import_job] = { id: ImportWorker.new_job_id, created_at: Time.current }

      @project.update(allowed_params)
      ImportWorker.perform_async(session[:import_job][:id], params[:id])

      flash[:notice] = I18n.t('projects.uploads.being_processed')
    end

    redirect_to [:import, @project]
  end

  def reports
    since = params[:since].nil? ? nil : params[:since].to_i.months.ago
    @service = IterationService.new(@project, since: since)
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

    result = ProjectOperations::Update.call(
      project: @project,
      project_attrs: { archived: archive ? Time.current : '0' },
      current_user: current_user
    )

    if result.success?
      redirect_to(
        @project.archived ? projects_path : @project,
        notice: t("projects.project was successfully #{archive ? 'archived' : 'unarchived'}")
      )
    else
      render action: 'edit'
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
              :iteration_start_day, :iteration_length, :import, :archived,
              :enable_tasks, :mail_reports, :velocity_strategy)
  end

  def fluid_layout
    @layout_settings[:fluid] = true
  end

  def set_project
    @project = current_user.projects.friendly.find(params[:id])
    authorize @project
  end

  def prepare_session
    session[:import_job] = (session[:import_job] || {}).with_indifferent_access
  end

  private

  def valid_name_confirmation?
    params[:name_confirmation] == @project.name
  end
end
