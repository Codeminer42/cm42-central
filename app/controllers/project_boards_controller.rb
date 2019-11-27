class ProjectBoardsController < ApplicationController
  def show
    authorize project
    project_board = StoryOperations::ReadAll.call(project: project)
    render json: project_board
  end

  private

  def project
    current_user.projects.friendly.find(params[:id])
  end
end
