class Stories::ActivitiesController < ApplicationController
  def index
    @project = policy_scope(Project).friendly.find(params[:project_id])
    @story = @project.stories.find(params[:story_id])
    @activities = policy_scope(Activity).by_story(@story.id)

    render json: @activities
  end
end
