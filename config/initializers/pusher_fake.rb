require "pusher-fake"

if Rails.env.development? || Rails.env.test?
  PusherFake.configure do |configuration|
    configuration.verbose = true
  end
end