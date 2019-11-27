class Beta::ProjectsController < ApplicationController
  before_action :set_fluid_layout

  def show
    authorize current_user
    @project_id = params[:id]
    @project = policy_scope(Project).friendly.find(@project_id)

    update_current_team
  end

  private

  def set_fluid_layout
    @layout_settings[:fluid] = true
  end
end
