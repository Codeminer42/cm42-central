class StoriesBulkUpdateController < ApplicationController
  def create
    authorize stories

    return render(json: { message: 'Stories not found' }, status: :not_found) if stories.blank?
    @updater = StoryOperations::UpdateAll.call(stories, allowed_params, current_user)

    if @updater
      render json: { message: 'Stories were successfully updated' }, status: :ok
    else
      render json: { error: stories.map(&:errors) }, status: :unprocessable_entity
    end
  end

  private

  def project
    @project ||= Project.find(params[:project_id])
  end

  def stories
    @stories ||= project.stories.where(id: params[:story_ids])
  end

  def allowed_params
    params
      .permit(:requested_by_id, :owned_by_id, :labels)
      .merge(acting_user: current_user)
  end
end
