module AptDependencies
  extend self

  def self.ensure!
    return "true" if deps_to_install.none?
    if sudo_password_required? && ENV["RAILS_ENV"] != "development"
      $stderr.puts "sudo requires password! cannot install #{deps_to_install.join(' ')}"
      exit 1
    else
      "sudo apt update && sudo apt install -y #{deps_to_install.join(' ')}"
    end
  end

  private

  def deps_to_install
    installed_deps = `apt list #{deps.join(' ')} --installed 2>/dev/null`.chomp.split("\n")[1..]
      .map { |line| line.split("/")[0] }
    deps - installed_deps
  end

  def deps
    @deps ||= File.readlines("Aptfile", chomp: true).select { |line| line.length > 0 }
  rescue Errno::ENOENT
    @deps = []
  end

  def sudo_password_required?
    !system("sudo -n true 2>/dev/null")
  end
end

