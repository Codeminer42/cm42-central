class StoriesBulkDestroyController < ApplicationController
  def create
    authorize stories

    result = StoryOperations::DestroyAll.call(
      stories: stories,
      current_user: current_user
    )

    match_result(result) do |on|
      on.success do
        render json: { message: t(:stories_destroy_success) }, status: :ok
      end
      on.failure do
        render(
          json: { errors: t(:stories_destroy_fail) },
          status: :unprocessable_entity
        )
      end
    end
  end

  private

  def stories
    @stories ||= current_project.stories.where(id: destroy_params)
  end

  def destroy_params
    params.require(:story_ids)
  end
end
