class CommentsController < ApplicationController
  before_action :set_comment
  before_action :set_project_and_story

  def show
    authorize @comment
  end

  def edit
    authorize @comment
  end

  def update
    authorize @comment
    CommentOperations::Save.call(
      story: @story,
      comment: @comment,
      comment_attrs: comment_attrs,
      current_user: current_user,
    )
    render action: :show
  end

  def destroy
    authorize @comment
    @comment.destroy
    render action: :show
  end

  protected

  def set_comment
    @comment = policy_scope(Comment).find(params[:id])
  end

  def set_project_and_story
    @project = policy_scope(Project).friendly.find(params[:project_id])
    @story   = policy_scope(Story).find(params[:story_id])
  end

  def comment_attrs
    params.fetch(:comment).permit(:body, attachments: [])
  end
end
