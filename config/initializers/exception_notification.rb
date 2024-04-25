require "exception_notification/rails"
require "exception_notification/sidekiq"

ExceptionNotification.configure do |config|
  config.ignored_exceptions = []

  # Adds a condition to decide when an exception must be ignored or not.
  # The ignore_if method can be invoked multiple times to add extra conditions.
  config.ignore_if do |exception, options|
    not Rails.env.production?
  end

  config.ignore_if do |exception, options|
    %w[
      ActiveRecord::RecordNotFound
      AbstractController::ActionNotFound
      ActionController::RoutingError
      ActionController::InvalidAuthenticityToken
      ActionView::MissingTemplate
      ActionController::BadRequest
      ActionDispatch::Http::Parameters::ParseError
      ActionDispatch::Http::MimeNegotiation::InvalidType
    ].include?(exception.class.to_s) &&
      !options.dig(:data, :sidekiq)
  end

  config.add_notifier :email, {
    email_prefix: "[#{File.basename(pwd)}] ",
    exception_recipients: "micah@botandrose.com",
    smtp_settings: {
      address: "smtp.gmail.com",
      port: 587,
      authentication: :plain,
      user_name: "errors@botandrose.com",
      password: "4pp3rr0rs",
      ssl: nil,
      tls: nil,
      enable_starttls_auto: true,
    }
  }
end

