class NotesController < ApplicationController
  before_action :set_project_and_story

  def destroy
    @note = policy_scope(Note).find(params[:id])
    authorize @note
    @note.destroy
    redirect_to @project
  end

  protected

  def allowed_params
    params.fetch(:note).permit(:note, :attachments)
  end

  def set_project_and_story
    @project = policy_scope(Project).friendly.find(params[:project_id])
    @story   = policy_scope(Story).find(params[:story_id])
  end
end
