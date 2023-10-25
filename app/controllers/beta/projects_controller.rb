class Beta::ProjectsController < ApplicationController
  before_action :set_fluid_layout

  def show
    project_slug = params[:id]
    @project = current_user.projects.friendly.find project_slug
    @project_id  = @project.id

    authorize @project, policy_class: Beta::ProjectPolicy
    update_current_team
  end

  private

  def set_fluid_layout
    @layout_settings[:fluid] = true
  end
end
