class Beta::ProjectBoardsController < ApplicationController
  before_action :set_fluid_layout

  def show
    result = Beta::ProjectBoardOperations::Read.call(
      params[:id],
      current_user,
      current_flow: cookies[:current_flow],
      projects_scope: policy_scope(Project)
    )

    authorize result.data.project, policy_class: Beta::ProjectPolicy
    render json: result.data.as_json(root: false)
  end

  private

  def set_fluid_layout
    @layout_settings[:fluid] = true
  end
end
