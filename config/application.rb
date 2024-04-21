require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Fulcrum
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w(assets tasks))

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    config.time_zone = "Pacific Time (US & Canada)"
    config.eager_load_paths << Rails.root.join("lib")

    config.active_job.queue_adapter = :sidekiq

    config.exceptions_app = self.routes

    config.active_record.belongs_to_required_by_default = false
    config.active_record.use_yaml_unsafe_load = true

    config.action_controller.raise_on_missing_callback_actions = false

    load Rails.root.join('config', 'fulcrum.rb')
    config.fulcrum = ::Configuration.for('fulcrum')
  end
end
