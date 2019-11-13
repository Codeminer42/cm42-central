class IntegrationWorker
  include Sidekiq::Worker
  include Central::Support::DiscordHelper
  include MattermostHelper
  include Central::Support::SlackHelper

  def perform(project_id, message)
    project = Project.find(project_id)
    project.integrations.each do |integration|
      case integration.kind
      when 'discord'
        send_discord(integration, message['discord'])
      when 'mattermost'
        send_mattermost(integration, message['mattermost'])
      when 'slack'
        send_slack(integration, message['slack'])
      end
    end
  end
end
