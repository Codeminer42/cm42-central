class Stories::ActivitiesController < ApplicationController
  def index
    @activities = policy_scope(Activity).by_story(params[:story_id])
    render json: @activities
  end
end
