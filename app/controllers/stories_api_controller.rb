class StoriesApiController < ApplicationController
  include ActionView::Helpers::TextHelper
  include Pundit

  before_action :set_project
  before_action :render_message, unless: :check_header
  skip_before_action :authenticate_user!, only: :create_from_api
  skip_after_action :verify_authorized

  def create_from_api
    @stories = stories_params.map do |story_params|
      create(story_params.merge(project: @project))
    end

    render json: @stories
  end

  private

  def create(story_params)
    story = @project.stories.build(allowed_params(story_params))


    StoryOperations::Create.call(story, @project.users.first)
  end

  def allowed_params(story)
    attachinary_params = %i[
      id public_id version signature width height format resource_type
      created_at tags bytes type etag url secure_url original_filename
    ]

    story.permit(:title, :description, :estimate, :story_type, :release_date,
      :state, :requested_by_id, :owned_by_id, :position, :labels,
      documents: attachinary_params,
      tasks_attributes: %i[id name done],
      notes_attributes: %i[id note]
    )
  end

  private

  def stories_params
    params.require(:stories)
  end

  def render_message
    render json: { message: "Missing the custom attribute in header" }
  end

  def check_header
    request.headers["x-api-key"] == ENV["EXPORT_API_TOKEN"]
  end

  def set_project
    @project = Project.friendly.find(params[:project_id]) #TODO: User policy_scope(Project)
  end
end
