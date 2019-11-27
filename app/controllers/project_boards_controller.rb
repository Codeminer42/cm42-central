class ProjectBoardsController < ApplicationController
  def show
    project = update_project(params[:id])
    authorize project
    project_board = StoryOperations::ReadAll.call(project: project)
    render json: project_board
  end

  private

  def project
    policy_scope(Project).friendly.find(params[:id])
  end
end
