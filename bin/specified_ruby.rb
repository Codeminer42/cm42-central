module SpecifiedRuby
  extend self

  def ensure!
    return "true" if native?
    install unless installed?
    restart unless current?
    "true"
  end

  private

  def native?
    begin
      require "rvm"
      false
    rescue LoadError
      native_version == version
    end
  end

  def native_version
    "ruby-#{`ruby -e 'puts RUBY_VERSION'`.chomp}"
  end

  def version
    File.read(".ruby-version").chomp
  end

  def gemset
    File.read(".ruby-gemset").chomp
  end

  def installed?
    installed_rubies = `rvm list strings`.split("\n")
    installed_rubies.include?(version)
  end

  def install
    system("rvm install #{version}") or exit 1
  end

  def current?
    require "rvm"
    RVM.use_from_path!(".")
    RVM.current.environment_name == [version, gemset].join("@")
  rescue RVM::IncompatibleRubyError
    false
  end

  def restart
    command = "rvm-exec #{$0}"
    unless %w[staging production].include?(ENV["RAILS_ENV"])
      command += " && rvm-exec $SHELL"
    end
    exec command
  end
end

