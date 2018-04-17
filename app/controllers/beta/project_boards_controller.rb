class Beta::ProjectBoardsController < ApplicationController
  before_action :set_fluid_layout

  def show
    authorize current_user

    result = ::ProjectBoardOperations::Read.call(
      params[:id],
      current_user,
      current_flow: cookies[:current_flow],
      projects_scope: policy_scope(Project)
    )

    if result.success?
      render json: result.data.as_json(root: false)
    end
  end

  private

  def set_fluid_layout
    @layout_settings[:fluid] = true
  end
end
