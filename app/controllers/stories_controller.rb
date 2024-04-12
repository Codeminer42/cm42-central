require 'dry/matcher/result_matcher'

class StoriesController < ApplicationController
  include ActionView::Helpers::TextHelper

  before_action :set_project

  def index
    @stories = select_stories_by_params
    render(csv: @stories.order(:position),
           exporter: Exporters::Stories,
           filename: @project.csv_filename)
  end

  def update
    @story = policy_scope(Story).find(params[:id])
    authorize @story

    @story.acting_user = current_user
    @story.base_uri = project_url(@story.project)

    result = StoryOperations::Update.call(
      story: @story,
      story_attrs: allowed_params,
      current_user: current_user
    )

    if result.success?
      redirect_to @project
    else
      redirect_to story_path(@story)
    end
  end

  def transition
    @story = policy_scope(Story).find(params[:id])
    authorize @story
    @story.send(params[:event])
    @story.save!
    redirect_to project_url(@project)
  end

  def destroy
    @story = policy_scope(Story).find(params[:id])
    authorize @story
    StoryOperations::Destroy.call(story: @story, current_user: current_user)
    redirect_to project_url(@project)
  end

  def done
    @stories = policy_scope(Story).done
    authorize Story, :done?
    render json: @stories
  end

  def backlog
    @stories = policy_scope(Story).backlog
    authorize Story, :backlog?
    render json: @stories
  end

  def in_progress
    @stories = policy_scope(Story).in_progress
    authorize Story, :in_progress?
    render json: @stories
  end

  def create
    update_current_team

    @story = policy_scope(Story).build(allowed_params)
    authorize @story

    @story.requested_by_id = current_user.id unless @story.requested_by_id

    result = StoryOperations::Create.call(story: @story, current_user: current_user)

    if result.success?
      redirect_to project_url(@project)
    else
      render action: 'new'
    end
  end

  private

  def select_stories_by_params
    if params[:q]
      StorySearch.query(policy_scope(Story), params[:q])
    elsif params[:label]
      StorySearch.labels(policy_scope(Story), params[:label])
    else
      @project.stories.with_dependencies
    end
  end

  def allowed_params
    params.require(:story).permit(
      :title, :description, :estimate, :story_type, :release_date,
      :state, :requested_by_id, :owned_by_id, :position, :labels,
      tasks_attributes: %i[id name done],
      notes_attributes: %i[id note]
    )
  end

  def set_project
    policy_scope(Project)
    @project = @current_user.projects.friendly.find(params[:project_id])
  end
end
