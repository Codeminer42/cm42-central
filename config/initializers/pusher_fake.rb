if (Rails.env.development? || Rails.env.test?) && ENV['PUSHER_FAKE'] == '1'
  require "pusher-fake"
  PusherFake.configuration.verbose = true
end
