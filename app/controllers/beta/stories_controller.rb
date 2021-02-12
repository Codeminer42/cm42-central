class Beta::StoriesController < ApplicationController
  before_action :set_project_and_story
  def sort
    authorize Story
    stories = Beta::SortStories.new(allowed_params).call
    render json: stories
  end

  private
  def allowed_params
    params.require(:story).permit(:position, :new_position, :id, :state, :project_id)
  end

  def set_project_and_story
    @project = policy_scope(Project).find(allowed_params[:project_id])
    @story   = policy_scope(Story).find(allowed_params[:id])
  end
end
