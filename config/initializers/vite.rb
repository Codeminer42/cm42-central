require "vite_ruby"

ViteRuby::Runner.prepend Module.new {
  def command_for(args)
    cmd = super
    if File.exist?("bin/node")
      if cmd[1] == "node"
        cmd[1] = "bin/node"
      else
        cmd.insert 1, "bin/node"
      end
    end
    cmd
  end
}
