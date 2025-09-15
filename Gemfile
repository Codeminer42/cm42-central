source 'https://rubygems.org'

ruby '3.1.7'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 6.1.7'

gem 'activeadmin'
gem 'api-pagination', '~> 6.0'
gem 'attachinary', '~> 1.3', '>= 1.3.1'
gem 'autoprefixer-rails', '~> 10.4', '>= 10.4.7.0' # The higher versions are broken in the CI, so for now we will keep this version, which is still stable.
gem 'bootstrap-sass', '~> 3.4', '>= 3.4.1'
gem 'chartkick', '~> 5.1', '>= 5.1.5'
gem 'chronic', '~> 0.10.2'
gem 'cloudinary'
gem 'compass-rails', '~> 3.1.0'
gem 'coffee-rails', '~> 5.0'
gem 'configuration'
gem 'dalli', '~> 3.2.3'
gem 'devise'
gem 'devise-async'
gem 'devise-authy', '~> 1.10.0'
gem 'devise-i18n'
gem 'differ'
gem 'dotenv-rails'
gem 'enumerize', '~> 2.5.0'
gem 'faraday'
gem 'foreman'
gem 'friendly_id', '~> 5.2.5'
gem 'gravtastic'
gem 'i18n-js', '~> 3.9.0'
gem 'jquery-atwho-rails'
gem 'jquery-ui-rails'
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
gem 'uglifier', '>= 2.5.3'
gem 'user_impersonate2', require: 'user_impersonate'
gem 'virtus'
gem 'pusher'
gem 'dry-monads'
gem 'dry-matcher'
gem 'vite_rails'

source 'http://insecure.rails-assets.org/' do
  gem 'rails-assets-jquery.gritter'
end

group :production do
  gem 'kgio'
  gem 'letsencrypt-rails-heroku'
  gem 'newrelic_rpm'
  gem 'rack-cache'
  gem 'rack-timeout'
  gem 'rails_12factor'
end

group :test do
  gem 'rails-controller-testing'
  gem 'capybara'
  gem 'capybara-lockstep'
  gem 'capybara-screenshot'
  gem 'codeclimate-test-reporter', require: nil
  gem 'database_cleaner'
  gem 'factory_bot_rails'
  gem 'selenium-webdriver'
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
  gem 'pry-rails'
  gem 'pry-remote'
  gem 'cypress-on-rails', '~> 1.0'
  gem "pusher-fake", '~> 3.0.1'
  gem 'rubocop', '0.63.1'
  gem 'rubocop-rspec'
end
