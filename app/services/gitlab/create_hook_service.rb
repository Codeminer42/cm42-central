module Gitlab
  class CreateHookService
    delegate :error_message, to: :api, allow_nil: true

    def initialize(project, params)
      @project = project
      @params = params
    end

    def fetch
      return unless gitlab_integration

      @api ||= GitlabApi::CreateHook.new(
        gitlab_integration.data['api_url'],
        gitlab_integration.data['private_token'],
        gitlab_integration.data['project_id'],
        @params
      ).perform

      api.success?
    end

    private

    def gitlab_integration
      @gitlab_integration ||= @project.integrations.find_by(kind: 'gitlab')
    end

    attr_reader :project, :api
  end
end
