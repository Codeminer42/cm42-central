# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative "config/application"

Rails.application.load_tasks

task :restart => :clear_cache do
  if ENV["RAILS_ENV"] == "production"
    sh "bundle exec foreman export systemd-user --app tracker"
  end
end

task :clear_cache => :environment do
  Story.touch_all
  Project.touch_all
  Rails.cache.clear
end

Rake.application["spec"].clear
spec = RSpec::Core::RakeTask.new(:spec)
spec.exclude_pattern = "spec/features/*"

task :cucumber => "spec:features"

