class ActivitiesController < ApplicationController
  before_action :set_project
  layout false

  def index
    @activity_groups = @project.board.recent_activity_groups
  end

  private

  def set_project
    @project = policy_scope(Project).friendly.find(params[:project_id])
    authorize @project
  end
end
