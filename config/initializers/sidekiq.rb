require 'sidekiq'

Sidekiq.configure_server do |config|
  config.redis = { url: ENV["REDISCLOUD_URL"] }
end
