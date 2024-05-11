class CommentsController < ApplicationController
  before_action :set_project_and_story

  def destroy
    @comment = policy_scope(Comment).find(params[:id])
    authorize @comment
    @comment.destroy
    redirect_to @project
  end

  protected

  def allowed_params
    params.fetch(:comment).permit(:body, :attachments)
  end

  def set_project_and_story
    @project = policy_scope(Project).friendly.find(params[:project_id])
    @story   = policy_scope(Story).find(params[:story_id])
  end
end
