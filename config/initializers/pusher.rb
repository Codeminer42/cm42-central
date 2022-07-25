Pusher.logger = Rails.logger
if Rails.env.development? || Rails.env.test?
  Pusher.encrypted = false
  Pusher.app_id = ENV['PUSHER_APP_ID']
  Pusher.key = ENV['PUSHER_APP_KEY']
  Pusher.secret = ENV['PUSHER_APP_SECRET']
  Pusher.host = ENV['PUSHER_HOST'].dup if ENV['PUSHER_HOST']
  Pusher.port = ENV['PUSHER_PORT'].to_i if ENV['PUSHER_PORT']
end
