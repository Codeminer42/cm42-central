require 'uri'

module Integrations
  module Mattermost
    module Helper
      def send_mattermost(integration, message)
        Integrations::Mattermost::Service.send(real_private_uri(integration.data['private_uri']),
                        integration.data['channel'],
                        integration.data['bot_username'],
                        message)
      end

      private def real_private_uri(private_uri)
        return ENV[private_uri] if private_uri.starts_with? 'INTEGRATION_URI'

        private_uri
      end
    end
  end
end
