Rails.application.configure do
  config.action_mailer.default_url_options = { host: config.fulcrum.app_host }
  config.action_mailer.default_options = { from: config.fulcrum.mailer_sender }
end

