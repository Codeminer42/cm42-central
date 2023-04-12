require "dry/matcher/result_matcher"

class StoriesController < ApplicationController
  include ActionView::Helpers::TextHelper

  before_action :set_project

  def index
    @stories = select_stories_by_params

    respond_to do |format|
      format.json { render json: @stories }
      format.csv do
        render(csv: @stories.order(:position),
               exporter: Exporters::Stories,
               filename: @project.csv_filename)
      end
    end
  end

  def show
    @story = policy_scope(Story).try(:with_dependencies).try(:find, params[:id])
    authorize @story
    render json: @story
  end

  def sort
    authorize Story
    scope = policy_scope(Story)
    @stories = SortStories.new(params[:ordered_ids], scope: scope).call
    render @stories, json: @stories
  end

  def update
    @story = policy_scope(Story).find(params[:id])
    authorize @story
    @story.acting_user = current_user
    @story.base_uri = project_url(@story.project)
    respond_to do |format|
      if StoryOperations::Update.call(@story, allowed_params, current_user)
        format.html { redirect_to project_url(@project) }
        format.js   { render json: @story }
      else
        format.html { render action: 'edit' }
        format.js   { render json: @story, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @story = policy_scope(Story).find(params[:id])
    authorize @story
    StoryOperations::Destroy.call(@story, current_user)
    head :ok
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
    result = StoryOperations::Create.new.call(story: @story, current_user: current_user)
    Dry::Matcher::ResultMatcher.(result) do |on|
      on.success do |story|
        respond_to do |format|
          format.html { redirect_to project_url(@project) }
          format.js   { render json: story }
        end
      end
      on.failure do |story|
        respond_to do |format|
          format.html { render action: 'new' }
          format.js   { render json: story, status: :unprocessable_entity }
        end
      end
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
    attachinary_params = %i[
      id public_id version signature width height format resource_type
      created_at tags bytes type etag url secure_url original_filename
    ]

    params.require(:story).permit(
      :title, :description, :estimate, :story_type, :release_date,
      :state, :requested_by_id, :owned_by_id, :position, :labels,
      documents: attachinary_params,
      tasks_attributes: %i[id name done],
      notes_attributes: %i[id note]
    )
  end

  def set_project
    policy_scope(Project)
    @project = @current_user.projects.friendly.find(params[:project_id])
  end
end
