require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Fulcrum
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.time_zone = "Pacific Time (US & Canada)"

    config.autoloader = :zeitwerk
    config.autoload_paths << Rails.root.join('lib')

    load Rails.root.join('config','fulcrum_defaults.rb')
    if File.exist?(Rails.root.join('config', 'fulcrum.rb'))
      load Rails.root.join('config','fulcrum.rb')
    end
    config.fulcrum = ::Configuration.for 'fulcrum'

    #FIXME this shouldn't be necessary in Rails 4 but the generator was falling back to test_unit
    config.generators do |g|
      g.test_framework :rspec
    end

    config.assets.paths << Rails.root.join('node_modules')
    config.paths.add Rails.root.join('lib').to_s, eager_load: true
    config.active_job.queue_adapter = :sidekiq
    config.exceptions_app = self.routes

    config.active_record.use_yaml_unsafe_load = true
  end
end
