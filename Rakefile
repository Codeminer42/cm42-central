# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Fulcrum::Application.load_tasks

task :restart do
  if ENV["RAILS_ENV"] == "production"
    sh "bundle exec foreman export systemd-user --app clients"
  end
end

file ".env" => ".env.sample" do
  cp ".env.sample", ".env"
end
task :bootstrap => ".env"

Rake.application["spec"].clear
spec = RSpec::Core::RakeTask.new(:spec)
spec.exclude_pattern = "spec/features/*"

features = RSpec::Core::RakeTask.new("spec:features")
features.pattern = "spec/features/*"
features.rspec_opts = "--format documentation"

task :cucumber => "spec:features"
