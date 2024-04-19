class NotesController < ApplicationController
  before_action :set_project_and_story

  def index
    @notes = policy_scope(Note)
    render json: @notes
  end

  def create
    @note = policy_scope(Note).build(allowed_params)
    authorize @note
    @note.user = current_user

    result = NoteOperations::Create.call(note: @note, current_user: current_user)

    match_result(result) do |on|
      on.success do |note|
        render json: note
      end
      on.failure do |note|
        render json: note, status: :unprocessable_entity
      end
    end
  end

  def show
    @note = policy_scope(Note).find(params[:id])
    authorize @note
    render json: @note
  end

  def destroy
    @note = policy_scope(Note).find(params[:id])
    authorize @note
    @note.destroy
    redirect_to @project
  end

  protected

  def allowed_params
    params.fetch(:note).permit(:note, :documents)
  end

  def set_project_and_story
    @project = policy_scope(Project).friendly.find(params[:project_id])
    @story   = policy_scope(Story).find(params[:story_id])
  end
end
