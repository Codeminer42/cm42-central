require 'sidekiq'

module Sidekiq::Middleware::Server
  class SetRetryCountMiddleware
    def call(worker, job_params, _queue)
      retry_count = job_params["retry_count"]
      worker.instance_variable_set(:@retry_count, retry_count)
      yield
    end
  end
end

Sidekiq.configure_server do |config|
  config.redis = { url: ENV["REDISCLOUD_URL"] }
  config.server_middleware do |chain|
    chain.add Sidekiq::Middleware::Server::SetRetryCountMiddleware
  end
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
end

