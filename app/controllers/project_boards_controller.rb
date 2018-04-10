class ProjectBoardsController < ApplicationController
  def show
    authorize current_user
    project_board = StoryOperations::ReadAll.call(project: project)

    render json: project_board
  end

  private

  def project
    policy_scope(Project).friendly.find(params[:id])
  end
end
