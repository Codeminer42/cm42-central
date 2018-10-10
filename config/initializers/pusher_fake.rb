if Rails.env.development? || Rails.env.test?
  require "pusher-fake"
  PusherFake.configure do |configuration|
    configuration.verbose = true
  end
end