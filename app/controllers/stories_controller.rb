require 'dry/matcher/result_matcher'

class StoriesController < ApplicationController
  include ActionView::Helpers::TextHelper
  include StoriesHelper
  include ActionView::RecordIdentifier

  before_action :set_project

  def create
    @story = policy_scope(Story).build
    authorize @story

    result = StoryOperations::Create.call(
      project: @project,
      story: @story,
      story_attrs: allowed_params,
      current_user: current_user
    )

    if result.failure?
      flash.alert = @story.errors.full_messages.join(" ")
    end
    redirect_to project_url(@project)
  end

  def update
    @story = policy_scope(Story).find(params[:id])
    authorize @story

    @story.base_uri = project_url(@story.project)

    result = StoryOperations::Update.call(
      story: @story,
      story_attrs: allowed_params,
      current_user: current_user
    )

    if result.failure?
      flash.alert = @story.errors.full_messages.join(" ")
    end
    redirect_to project_url(@project)
  end

  def transition
    @story = policy_scope(Story).find(params[:id])
    authorize @story
    @story.send(params[:event])
    StoryOperations::Update.call(
      story: @story,
      story_attrs: { state: @story.state },
      current_user: current_user,
    )
    redirect_to project_url(@project)
  end

  def destroy
    @story = policy_scope(Story).find(params[:id])
    authorize @story
    StoryOperations::Destroy.call(story: @story, current_user: current_user)
    redirect_to project_url(@project)
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
      :state, :requested_by_id, :owned_by_id, :labels, :positioning_column, :position,
      position: %i[before after],
      tasks_attributes: %i[id name done],
      notes_attributes: [
        :id,
        :note,
        :user_id,
        attachments: []
      ],
    )
  end

  def set_project
    policy_scope(Project)
    @project = @current_user.projects.friendly.find(params[:project_id])
  end
end
