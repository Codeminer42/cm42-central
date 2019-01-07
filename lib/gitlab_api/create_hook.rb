# frozen_string_literal: true

module GitlabApi
  class CreateHook
    SUCCESS_RESPONSE_CODE = 201

    def initialize(api_url, private_token, project_id, params)
      @project_id = project_id
      @gitlab_api = GitlabApi::Client.new(api_url, private_token, SUCCESS_RESPONSE_CODE)
      @params = params
    end

    def perform
      @gitlab_api.post do |req|
        req.url path
        req.body = @params.to_json
      end
    end

    private

    def path
      "projects/#{@project_id}/hooks"
    end
  end
end
