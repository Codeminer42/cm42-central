source 'https://rubygems.org'

ruby '2.3.1'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '4.2.7.1'

gem 'activeadmin', '~> 1.0.0.pre4'
gem 'api-pagination'
gem 'attachinary'
gem 'autoprefixer-rails'
gem 'bootstrap-sass', '~> 3.3.5'
gem 'central-support', github: 'Codeminer42/cm42-central-support', require: 'central/support'
gem 'chartkick'
gem 'chronic'
gem 'cloudinary'
gem 'coffee-rails'
gem 'compass-rails'
gem 'configuration'
gem 'dalli'
gem 'devise', '~> 3.5.4'
gem 'devise-async'
gem 'devise-authy'
gem 'devise-i18n'
gem 'differ'
gem 'dotenv-rails'
gem 'foreman'
gem 'friendly_id', '~> 5.2.4'
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
gem 'pg'
gem 'pg_search'
gem 'platform-api'
gem 'puma'
gem 'pundit'
gem 'rack-cors', require: 'rack/cors'
gem 'rails-i18n'
gem 'recaptcha', require: 'recaptcha/rails'
gem 'rgb_utils'
gem 'rollbar'
gem 'sass-rails'
gem 'sidekiq'
gem 'sidekiq_mailer'
gem 'sinatra', require: nil
gem 'uglifier', '>= 2.5.3'
gem 'user_impersonate2', require: 'user_impersonate'
gem 'webpacker'
gem 'pusher'

source 'https://rails-assets.org' do
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
  gem 'rspec-rails'
  gem 'rspec-its'
  gem 'rspec-activemodel-mocks'
  gem 'shoulda-matchers'
  gem 'capybara'
  gem 'poltergeist'
  gem 'capybara-screenshot'
  gem 'database_cleaner'
  gem 'factory_girl_rails'
  gem 'codeclimate-test-reporter', require: nil
  gem 'vcr'
  gem 'webmock'
  gem 'timecop'
  gem 'simplecov'
end

group :development do
  gem 'letter_opener'
  gem 'letter_opener_web', '~> 1.3.4'
  gem "better_errors"
  gem "binding_of_caller"
  gem "bullet"
  gem 'rubocop', '0.49.1'
end

group :development, :test do
  gem 'pry-rails'
  gem 'pry-remote'
  gem 'quiet_assets'
end
