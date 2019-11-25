require 'net/http'

module Integrations
  module Discord
    class Service
      def self.send(private_uri, bot_username, message)
        self.new(private_uri, bot_username).send(message)
      end

      def initialize(private_uri, bot_username = 'marvin')
        @private_uri = URI.parse(private_uri)
        @bot_username = bot_username
      end

      def send(text)
        if Rails.env.development?
          Rails.logger.debug('NOT SENDING TO OUTSIDE INTEGRATION!')
          Rails.logger.debug("URL: #{@private_uri}")
          Rails.logger.debug("Payload: #{payload(text)}")
        else
          Net::HTTP.start(@private_uri.host, @private_uri.port, use_ssl: true) do |https|
            request = Net::HTTP::Post.new(
              @private_uri.request_uri, 'Content-Type': 'application/json'
            )
            request.body = payload(text).to_json

            https.request(request)
          end
        end
      end

      def payload(text, truncate_at = 2000)
        text = { description: text } if text.is_a?(String)

        embeds = [text].flatten.each do |embed|
          next if embed[:description].blank?

          embed[:description] = embed[:description].truncate(truncate_at)
        end

        {
          username: @bot_username,
          embeds: embeds
        }
      end
    end
  end
end
