source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 6.1.7'
gem 'pg'
gem 'pg_search'
gem 'bard-rake'
gem 'backhoe', '>= 0.8.0'
gem 'dotenv-rails'
gem 'activeadmin'
gem 'api-pagination'
gem 'positioning'
gem 'attachinary'
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
gem 'enumerize', '~> 2.5.0'
gem 'faraday'
gem 'friendly_id', '~> 5.2.5'
gem 'gravtastic'
gem 'kaminari'
gem 'platform-api'
gem 'pundit'
gem 'rack-cors', require: 'rack/cors'
gem 'rails-i18n'
gem 'recaptcha', require: 'recaptcha/rails'
gem 'rgb_utils'
gem 'slim-rails'
gem 'transitions', require: ["transitions", "active_model/transitions"]
gem 'user_impersonate2', require: 'user_impersonate'
gem 'virtus'
gem 'pusher'
gem 'dry-monads'
gem 'dry-matcher'

gem 'sass-rails'
gem 'material_icons'
gem 'bootstrap-sass', '~> 3.4.0'

gem 'sprockets', '~>4.0'
gem 'importmap-rails', '~>1.0' # 2.0 vendors
gem 'turbo-rails'
gem 'stimulus-rails'
gem 'redis'

gem 'sidekiq'
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
  gem 'cucumber-rails'
  gem 'cucumber', require: false, github: 'botandrose/cucumber', branch: 'restore_looser_line_numbers'
  gem 'cuprite-downloads'
  gem 'database_cleaner'
  gem 'factory_bot_rails'
  gem 'puma', '~> 5.6.4'
  gem 'selenium-webdriver'
  gem 'webdrivers'
  gem "rack-disable_css_animations"
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
  gem 'bard'
  gem 'byebug'
  gem 'pry-rails'
  gem 'pry-remote'
  gem "pusher-fake", '~> 3.0.1'
  gem 'rubocop', '0.63.1'
  gem 'rubocop-rspec'
end
