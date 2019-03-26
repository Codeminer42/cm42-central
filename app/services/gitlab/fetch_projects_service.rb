module Gitlab
  class FetchProjectsService
    delegate :error_message, to: :api, allow_nil: true

    def initialize(project)
      @project = project
    end

    def fetch
      return unless gitlab_integration

      @api ||= GitlabApi::FetchProjects.new(
        gitlab_integration.data['api_url'],
        gitlab_integration.data['private_token']
      ).perform

      api.success?
    end

    def projects
      return unless api&.success?

      api.data.map { |project| Gitlab::Project.new(project) }
    end

    private

    def gitlab_integration
      @gitlab_integration ||= @project.integrations.find_by(kind: 'gitlab')
    end

    attr_reader :project, :api
  end
end
