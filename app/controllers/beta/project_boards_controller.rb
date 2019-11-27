class Beta::ProjectBoardsController < ApplicationController
  before_action :set_fluid_layout

  def show
    authorize current_user

    result = Beta::ProjectBoardOperations::Read.call(
      current_user,
      update_project(params[:id]),
      current_flow: cookies[:current_flow]
    )

    render json: result.data.as_json(root: false)
  end

  private

  def project
    @project ||= policy_scope(Project).friendly.find(params[:id])
  end

  def set_fluid_layout
    @layout_settings[:fluid] = true
  end
end
