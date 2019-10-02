class Beta::ProjectsController < ApplicationController
  before_action :set_fluid_layout

  def show
    authorize current_user
    @project_id = params[:id]
    @project = current_user.projects.friendly.find @project_id
  end

  private

  def set_fluid_layout
    @layout_settings[:fluid] = true
  end
end
