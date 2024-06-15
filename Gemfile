source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# model
gem "bootsnap", require: false
gem 'rails', '~>7.1.0'
gem 'trilogy'
gem 'bard-rake'
gem 'backhoe'
gem 'transitions', require: ["transitions", "active_model/transitions"]
gem 'minidusen'
gem 'virtus'
gem 'positioning'
gem 'configuration'
gem 'dalli', '~> 3.2.3'
gem 'differ'
gem 'enumerize', '~> 2.5.0'
gem 'friendly_id', '~> 5.2.5'
gem 'aws-sdk-s3'
gem 'image_processing'
gem 'pivotal-tracker-api', github: 'AgileVentures/pivotal-tracker-api'
gem 'sorted_set'

# controller
gem 'pundit'
gem 'dry-matcher'
gem 'dry-monads'

# view
gem 'rails-i18n'
gem 'slim-rails'
gem 'gravtastic'
gem 'rails_autolink'
gem 'bard-file_field'
gem 'user_impersonate2', require: 'user_impersonate'
gem 'activeadmin'
gem 'devise'
gem 'devise-async'
gem 'devise-i18n'
gem 'commonmarker'
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
gem 'sidekiq-scheduler'
gem 'sidekiq_mailer'
gem 'exception_notification', github: 'smartinez87/exception_notification'
gem 'foreman'

group :production do
  gem 'rack-cache'
  gem 'rack-timeout'
  gem 'foreman-export-systemd_user'
end

group :test do
  gem 'rails-controller-testing'
  gem 'capybara'
  gem 'capybara-screenshot'
  gem 'chop'
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
  gem 'email_spec', '~>2.0'
  gem 'simplecov'
  gem 'timecop'
  gem 'vcr'
  gem 'webmock'
end

group :development do
  gem 'rack-mini-profiler'
  gem 'memory_profiler'
  gem 'stackprof'
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'letter_opener'
  gem 'letter_opener_web'
end

group :development, :test do
  gem 'bullet'
  gem 'bard'
  gem 'byebug'
  gem 'parallel_tests', '~>3.9.0' # 3.10 pegs CPU
  gem 'pry-rails'
  gem 'rspec-rails'
end
