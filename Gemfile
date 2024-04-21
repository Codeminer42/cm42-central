source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# model
gem 'rails', '~>7.1.0'
gem 'mysql2'
gem 'bard-rake'
gem 'backhoe'
gem 'dotenv-rails'
gem 'transitions', require: ["transitions", "active_model/transitions"]
gem 'virtus'
gem 'positioning'
gem 'chronic'
gem 'configuration'
gem 'dalli', '~> 3.2.3'
gem 'differ'
gem 'enumerize', '~> 2.5.0'
gem 'faraday'
gem 'friendly_id', '~> 5.2.5'
gem 'image_processing'

# controller
gem 'platform-api'
gem 'api-pagination'
gem 'pundit'
gem 'dry-matcher'
gem 'dry-monads'

# view
gem 'rails-i18n'
gem 'rgb_utils'
gem 'recaptcha', require: 'recaptcha/rails'
gem 'slim-rails'
gem 'kaminari'
gem 'user_impersonate2', require: 'user_impersonate'
gem 'activeadmin'
gem 'gravtastic'
gem 'devise'
gem 'devise-async'
gem 'devise-i18n'
gem 'chartkick'

# css
gem 'sprockets', '~>4.0'
gem 'sass-rails'
gem 'material_icons', '~>2.0' # 3.0 breaks shit?
gem 'bootstrap-sass', '~> 3.4.0'

# js
gem 'importmap-rails', '~>1.0' # 2.0 vendors
gem 'turbo-rails'
gem 'stimulus-rails'
gem 'redis'

# production
gem 'sidekiq', '~>6.0' # 7.0 requires redis 6.2+
gem 'sidekiq_mailer'
gem 'sinatra', require: nil
gem 'rollbar', '~> 3.3'
gem "exception_notification"
gem 'foreman'

group :production do
  gem 'kgio'
  gem 'rack-cache'
  gem 'rack-timeout'
  gem 'foreman-export-systemd_user'
end

group :test do
  gem 'rails-controller-testing'
  gem 'capybara'
  gem 'capybara-screenshot'
  gem 'chop'
  gem 'codeclimate-test-reporter', require: nil
  gem 'cucumber-rails', require: false
  gem 'cuprite-downloads'
  gem 'rack-disable_css_animations'
  gem 'database_cleaner'
  gem 'factory_bot_rails'
  gem 'puma'
  gem 'rspec-retry'
  gem 'rspec-activemodel-mocks'
  gem 'rspec-its'
  gem 'shoulda-matchers'
  gem 'simplecov'
  gem 'timecop'
  gem 'vcr'
  gem 'webmock'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'bullet'
  gem 'letter_opener'
  gem 'letter_opener_web'
end

group :development, :test do
  gem 'bard'
  gem 'byebug'
  gem 'pry-rails'
  gem 'pry-remote'
  gem 'rubocop', '0.63.1'
  gem 'rubocop-rspec'
  gem 'rspec-rails'
end
