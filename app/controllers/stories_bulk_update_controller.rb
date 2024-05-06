class StoriesBulkUpdateController < ApplicationController
  def create
    authorize stories

    return render(json: { message: 'Stories not found' }, status: :not_found) if stories.blank?

    result = StoryOperations::UpdateAll.call(
      stories: stories,
      stories_attrs: allowed_params,
      current_user: current_user
    )

    match_result(result) do |on|
      on.success do |stories|
        returns_message stories
      end
      on.failure do
        returns_message false
      end
    end
  end

  private

  def stories
    @stories ||= current_project.stories.where(id: params[:story_ids])
  end

  def allowed_params
    params
      .permit(:requested_by_id, :owned_by_id, :labels)
      .merge(acting_user: current_user)
  end

  def returns_message(records)
    if records
      render json: { message: t(:update_stories_successfully) }
    else
      render json: { error: stories.map(&:errors) }, status: :unprocessable_entity
    end
  end
end
