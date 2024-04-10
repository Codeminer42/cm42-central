source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 6.1.7'

gem 'activeadmin'
gem 'api-pagination'
gem 'attachinary'
gem 'bard'
gem 'bard-rake'
gem 'backhoe', '>= 0.8.0'
gem 'bootstrap-sass', '~> 3.4.0'
gem 'chartkick'
gem 'chronic'
gem 'cloudinary'
gem 'configuration'
gem 'dalli', '~> 3.2.3'
gem 'devise'
gem 'devise-async'
gem 'devise-authy', '~> 1.10.0'
gem 'devise-i18n'
gem 'differ'
gem 'dotenv-rails'
gem 'enumerize', '~> 2.5.0'
gem "exception_notification"
gem 'faraday'
gem 'foreman'
gem 'friendly_id', '~> 5.2.5'
gem 'gravtastic'
gem 'kaminari'
gem 'material_icons'
gem 'pg'
gem 'pg_search'
gem 'platform-api'
gem 'puma', '~> 5.6.4'
gem 'pundit'
gem 'rack-cors', require: 'rack/cors'
gem 'rails-i18n'
gem 'recaptcha', require: 'recaptcha/rails'
gem 'rgb_utils'
gem 'rollbar', '~> 3.3'
gem 'sass-rails'
gem 'sidekiq'
gem 'sidekiq_mailer'
gem 'sinatra', require: nil
gem 'transitions', require: ["transitions", "active_model/transitions"]
gem 'user_impersonate2', require: 'user_impersonate'
gem 'virtus'
gem 'pusher'
gem 'dry-monads'
gem 'dry-matcher'

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
  gem 'codeclimate-test-reporter', require: nil
  gem 'database_cleaner'
  gem 'factory_bot_rails'
  gem 'selenium-webdriver'
  gem 'webdrivers'
  gem 'rspec-retry'
  gem 'rspec-activemodel-mocks'
  gem 'rspec-its'
  gem 'rspec-rails'
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
  gem 'byebug'
  gem 'pry-rails'
  gem 'pry-remote'
  gem "pusher-fake", '~> 3.0.1'
  gem 'rubocop', '0.63.1'
  gem 'rubocop-rspec'
end
