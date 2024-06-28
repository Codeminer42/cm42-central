class ProjectBoardsController < ApplicationController
  def show
    authorize project

    result = StoryOperations::ReadAll.call(project: project)
    project_board = result.value!

    render json: project_board
  end

  private

  def project
    current_user.projects.friendly.find(params[:id])
  end
end
