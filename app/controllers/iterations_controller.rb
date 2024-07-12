class IterationsController < ApplicationController
  before_action :set_project

  helper_method :iteration
  attr_reader :iteration

  def show
    index = params[:id].to_i - 1
    @iteration = @project.board.past_iterations[index]
    authorize @project
  end

  private

  def set_project
    policy_scope(Project)
    @project = @current_user.projects.friendly.find(params[:project_id])
  end
end

