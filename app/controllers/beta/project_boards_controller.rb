class Beta::ProjectBoardsController < ApplicationController
  before_action :set_fluid_layout

  def show
    result = Beta::ProjectBoardOperations::Read.call(
      project_id: params[:id],
      current_user: current_user,
      current_flow: cookies[:current_flow],
      projects_scope: policy_scope(Project)
    )

    @project = result.success.project
    authorize @project, policy_class: Beta::ProjectPolicy
    response = result.data.as_json(root: false)
    render json: set_collapsed_story_in_response(response)
  end

  private

  def set_fluid_layout
    @layout_settings[:fluid] = true
  end

  def set_collapsed_story_in_response(response)
    stories = response["stories"]
    response["stories"] = ProjectBoardsSerializer.collapsed_stories(stories)
    response
  end
end
