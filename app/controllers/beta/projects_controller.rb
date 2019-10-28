class Beta::ProjectsController < ApplicationController
  before_action :set_fluid_layout

  def show
    authorize current_user
    @project_id = params[:id]
    options = { project: @current_project, current_story: @story }
    pundit = PunditContext.new(@current_team, @current_user, options)
    @project = ProjectPolicy::Scope.new(pundit, @current_user).show_project(params[:id])
    update_current_team
  end

  private

  def set_fluid_layout
    @layout_settings[:fluid] = true
  end
end
