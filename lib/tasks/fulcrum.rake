namespace :fulcrum do
  desc 'Set up database yaml.'
  task :setup do
    db = ENV['DB'] || 'postgresql'
    example_database_config = Rails.root.join('config', "database.yml.#{db}")
    database_config = Rails.root.join('config', 'database.yml')

    if File.exist?(database_config)
      puts "#{database_config} already exists!"
    else
      cp example_database_config, database_config
    end
  end

  desc "Create a user. A confirmation email will be sent to the user's address."
  task :create_user, %i[email name initials password] => :environment do |_, args|
    user = User.create!(
      email: args.email, name: args.name, initials: args.initials,
      password: args.password, password_confirmation: args.password
    )
    user.confirm
  end
end
