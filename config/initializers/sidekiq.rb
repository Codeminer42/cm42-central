require 'sidekiq'

Sidekiq.configure_server do |config|
  config.redis = { url: ENV["REDISCLOUD_URL"] }
end
Rails.application.config.before_initialize do |app|
  initializer = app.initializers.find do |initializer|
    initializer.name == "sidekiq.rails_logger"
  end

  def initializer.run(*args)
    # no-op
  end
end

Rails.application.config.after_initialize do
  Sidekiq.configure_server do |config|
    config[:reloader] = Sidekiq::Rails::Reloader.new

    # This is the integration code necessary so that if a job uses `Rails.logger.info "Hello"`,
    # it will appear in the Sidekiq console with all of the job context.
    unless ::Rails.logger == config.logger || ::ActiveSupport::Logger.logger_outputs_to?(::Rails.logger, $stdout)
      ::Rails.logger = ::ActiveSupport::BroadcastLogger.new(::Rails.logger, config.logger)
      formatter = ActiveSupport::Logger::SimpleFormatter.new
      formatter.extend ActiveSupport::TaggedLogging::Formatter
      ::Rails.logger.formatter = formatter
    end
  end


  ActionMailer::MessageDelivery.prepend Module.new {
    def deliver_later(options = {})
      options[:wait] = 5.seconds if Rails.env.production?
      super(options)
    end
  }
end

