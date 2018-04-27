class ProjectBoardsController < ApplicationController
  def show
    authorize project
    project_board = StoryOperations::ReadAll.call(
      project: project,
      iteration_length: iteration_length
    )

    render json: project_board
  end

  private

  def project
    policy_scope(Project).friendly.find(params[:id])
  end

  def iteration_length
    return unless iteration_length_params
    iteration_length_params.to_i
  end

  def iteration_length_params
    params.permit(:iteration_length)[:iteration_length]
  end
end
