class ProjectBoardsController < ApplicationController
  def show
    project = update_project(params[:id])
    authorize project
    project_board = StoryOperations::ReadAll.call(project: project)
    render json: project_board
  end
end
