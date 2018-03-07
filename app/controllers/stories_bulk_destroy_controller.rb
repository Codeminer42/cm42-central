class StoriesBulkDestroyController < ApplicationController
  def create
    authorize stories
    destroyed_stories = StoryOperations::DestroyAll.call(stories, current_user)

    if destroyed_stories
      render json: { message: t(:stories_destroy_success) }, status: :ok
    else
      render(
        json: { errors: t(:stories_destroy_fail) },
        status: :unprocessable_entity
      )
    end
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
