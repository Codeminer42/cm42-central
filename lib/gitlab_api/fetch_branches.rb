# frozen_string_literal: true

module GitlabApi
  class FetchBranches
    SUCCESS_RESPONSE_CODE = 200

    def initialize(api_url, private_token, project_id)
      @project_id = project_id
      @gitlab_api = GitlabApi::Client.new(api_url, private_token, SUCCESS_RESPONSE_CODE)
    end

    def perform
      @gitlab_api.get(path)
    end

    private

    def path
      "projects/#{@project_id}/repository/branches"
    end
  end
end
