module Stories
  class BulkCreateController < ApplicationController
    include ActionView::Helpers::TextHelper
    include Pundit

    before_action :set_project
    before_action :render_message, unless: :check_header
    skip_before_action :authenticate_user!, only: :create
    skip_after_action :verify_authorized

    def create
      stories = StoryOperations::CreateMany.create_stories(stories_params)

      render json: stories, status: :created
    end

    private

    def stories_params
      attachinary_params = %i[
        id public_id version signature width height format resource_type
        created_at tags bytes type etag url secure_url original_filename
      ]

      params.permit(stories: [:title, :description, :estimate, :story_type, :release_date,
        :state, :requested_by_id, :owned_by_id, :position, :labels,
        documents: attachinary_params,
        tasks_attributes: %i[id name done],
        notes_attributes: %i[id note]]).require(:stories).map do |story|
          story.merge(project: @project)
        end
    end

    def render_message
      render json: { message: 'Missing the custom attribute in header' }, status: :unauthorized
    end

    def check_header
      request.headers['x-api-key'] == ENV['EXPORT_API_TOKEN']
    end

    def set_project
      @project = Project.friendly.find(params[:project_id])
    end
  end
end
