class ProjectBoardsController < ApplicationController
  def show
    authorize project
    project_board = StoryOperations::ReadAll.call(project: project)
    render json: project_board
  end

  private

  def project
    @project = ProjectPolicy::Scope.new(pundit_project, current_user).show_project(params[:id])
  end
end
