module SpecifiedBundler
  extend self

  def ensure!
    system("gem install bundler --conservative --version=#{bundler_version}") or raise "Cannot install bundler!"
    "(bundle check || bundle install)"
  end

  private

  def bundler_version
    lines = File.readlines("Gemfile.lock")
    lines.last.strip if lines[-2] == "BUNDLED WITH\n"
  end
end
