class StoriesBulkDestroyController < ApplicationController
  def create
    authorize stories
    stories.map do |story|
      StoryOperations::Destroy.call(story, current_user)
    end

    redirect_to project, notice: "Stories was successfully destroyed."
  end

  private

  def project
    @project ||= Project.find(params[:project_id])
  end

  def stories
    @stories ||= project.stories.where(id: destroy_params)
  end

  def destroy_params
    params.require(:story_ids)
  end
end
