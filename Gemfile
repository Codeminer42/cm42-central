source 'https://rubygems.org'

ruby '2.6.0'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~>5.2.2'

gem 'activeadmin'
gem 'api-pagination'
gem 'attachinary'
gem 'autoprefixer-rails'
gem 'bootstrap-sass', '~> 3.4.0'
gem 'central-support', github: 'Codeminer42/cm42-central-support', require: 'central/support'
gem 'chartkick'
gem 'chronic'
gem 'cloudinary'
gem 'coffee-rails'
gem 'compass-rails'
gem 'configuration'
gem 'dalli'
gem 'devise'
gem 'devise-async'
gem 'devise-authy', '~> 1.10.0'
gem 'devise-i18n'
gem 'differ'
gem 'dotenv-rails'
gem 'enumerize', '~> 2.3.1'
gem 'faraday'
gem 'foreman'
gem 'friendly_id', '~> 5.2.5'
gem 'grape'
gem 'grape-entity'
gem 'grape-swagger'
gem 'grape-swagger-rails'
gem 'gravtastic'
gem 'i18n-js', '>= 3.0.0.rc8'
gem 'jquery-atwho-rails'
gem 'jquery-ui-rails'
gem 'kaminari'
gem 'material_icons'
gem 'newrelic_rpm'
gem 'pg'
gem 'pg_search'
gem 'platform-api'
gem 'puma'
gem 'pundit'
gem 'rack-cors', require: 'rack/cors'
gem 'rails-i18n'
gem 'recaptcha', require: 'recaptcha/rails'
gem 'rgb_utils'
gem 'rollbar', '~> 2.18'
gem 'sass-rails'
gem 'sidekiq'
gem 'sidekiq_mailer'
gem 'sinatra', require: nil
gem 'uglifier', '>= 2.5.3'
gem 'user_impersonate2', require: 'user_impersonate'
gem 'virtus'
gem 'webpacker', '>= 4.0.x'
gem 'pusher'

source 'https://rails-assets.org' do
  gem 'rails-assets-jquery.gritter'
end

group :production do
  gem 'kgio'
  gem 'letsencrypt-rails-heroku'
  gem 'rack-cache'
  gem 'rack-timeout'
  gem 'rails_12factor'
end

group :test do
  gem 'rails-controller-testing'
  gem 'capybara'
  gem 'capybara-screenshot'
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
  gem 'rubocop', '0.63.1'
  gem 'rubocop-rspec'
end

group :development, :test do
  gem 'pry-rails'
  gem 'pry-remote'
  gem "pusher-fake", "~> 1.10"
end
