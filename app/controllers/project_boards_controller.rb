class ProjectBoardsController < ApplicationController
  def show
    authorize project
    project_board = StoryOperations::ReadAll.call(project: project)
    render json: project_board, status: :ok
  end

  private

  def project
    options = { project: @current_project, current_story: nil }
    pundit = PunditContext.new(@current_team, current_user, options)
    @project = ProjectPolicy::Scope.new(pundit, current_user).show_project(params[:id])
  end
end
