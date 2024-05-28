class ProjectsController < ApplicationController
  before_action :set_project, only: %i[show search edit update destroy
                                       reports archive unarchive]
  before_action -> { define_sidebar :project_settings }, only: :edit
  before_action :set_story_flow, only: %i[show]
  before_action :fluid_layout, only: %i[show edit]

  def index
    @projects = policy_scope(Project) # map ProjectPresenter.from_collection(collection)
    @activities_group = Activity.grouped_activities(@projects, 1.week.ago)
    @pivotal_projects = policy_scope(PivotalProject).importable.show_hidden(params[:show_hidden])
    redirect_to @projects.first if !current_user.admin? && @projects.size == 1
  end

  def new
    @project = policy_scope(Project).new
    authorize @project
  end

  def show
    if params[:q]
      @search = StorySearch.query(policy_scope(Story), params[:q])
    elsif params[:label]
      @search = StorySearch.labels(policy_scope(Story), params[:label])
    end
    @new_todo_story = @project.stories.build(state: "unstarted")
    @new_icebox_story = @project.stories.build(state: "unscheduled")
    session[:current_project_slug] = @project.slug
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
      .permit(:name, :point_scale, :default_velocity, :start_date,
              :iteration_start_day, :iteration_length, :archived,
              :enable_tasks, :mail_reports, :velocity_strategy)
  end

  def fluid_layout
    @fluid_layout = true
  end

  def set_project
    @project = current_user.projects.friendly.find(params[:id])
    authorize @project
  end

  private

  def valid_name_confirmation?
    params[:name_confirmation] == @project.name
  end
end
