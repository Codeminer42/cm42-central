module Gitlab
  class FetchBranchesService
    delegate :error_message, to: :api, allow_nil: true

    def initialize(project)
      @project = project
    end

    def fetch
      return unless gitlab_integration

      @api ||= GitlabApi::FetchBranches.new(
        gitlab_integration.data['api_url'],
        gitlab_integration.data['private_token'],
        gitlab_integration.data['project_id']
      ).perform

      api.success?
    end

    def branches
      return unless api&.success?

      api.data.map { |branch| Gitlab::Branch.new(branch) }
    end

    private

    def gitlab_integration
      @gitlab_integration ||= @project.integrations.find_by(kind: 'gitlab')
    end

    attr_reader :project, :api
  end
end
