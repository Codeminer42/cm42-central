# frozen_string_literal: true

module GitlabApi
  class FetchProjects
    SUCCESS_RESPONSE_CODE = 200

    def initialize(api_url, private_token)
      @gitlab_api = GitlabApi::Client.new(api_url, private_token, SUCCESS_RESPONSE_CODE)
    end

    def perform
      @gitlab_api.get(path)
    end

    private

    def path
      'projects'
    end
  end
end
