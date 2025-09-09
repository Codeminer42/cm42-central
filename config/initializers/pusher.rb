Pusher.logger = Rails.logger

if Rails.env.development? || Rails.env.test?
  Pusher.app_id = ENV['PUSHER_APP_ID']
  Pusher.key = ENV['PUSHER_APP_KEY']
  Pusher.secret = ENV['PUSHER_APP_SECRET']
  Pusher.encrypted = false
  Pusher.host = '127.0.0.1'
  Pusher.port = (ENV['PUSHER_PORT'] || '8888').to_i
end
