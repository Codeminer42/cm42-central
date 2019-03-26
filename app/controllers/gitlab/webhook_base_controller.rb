module Gitlab
  class WebhookBaseController < ActionController::Base
    before_action :validate_secret_key

    def validate_secret_key
      head :unprocessable_entity unless valid_secret_key?
    end

    private

    def valid_secret_key?
      request.headers['X-Gitlab-Token'] == integration.data['secret_key']
    end

    def integration
      @integration ||= project.integrations.find_by(kind: 'gitlab')
    end

    def project
      @project ||= story.project
    end

    def story
      @story ||= Story.find_by branch: params['object_attributes']['source_branch']
    end
  end
end
