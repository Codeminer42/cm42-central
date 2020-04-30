class StoriesApiController < ActionController::API
  include ActionView::Helpers::TextHelper
  include Pundit

  before_action :set_project, except: :create_from_api
  before_action :render_message, unless: :check_header
  skip_before_action :authenticate_user!, only: :create_from_api
  skip_after_action :verify_authorized

  def create(story_params)
    @story = policy_scope(Story).build(allowed_params(story_params))
    if StoryOperations::Create.call(@story, User.first)
      render json: @story
    end
  end

  def create_from_api
    params[:stories].each do |story_params|
      create(story_params)
    end
  end

  private

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

  def stories_params
    attachinary_params = %i[
      id public_id version signature width height format resource_type
      created_at tags bytes type etag url secure_url original_filename
    ]

    params.require(:story)
  end

  def render_message
    render json: { message: "Missing the custom attribute in header" }
  end

  def check_header
    request.headers["x-api-key"] == ENV["EXPORT_API_TOKEN"]
  end
end
