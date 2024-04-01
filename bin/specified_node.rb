module SpecifiedNode
  extend self

  NODE_VERSION = "v16.20.2"
  NODE_PATH = "tmp/node-#{NODE_VERSION}-linux-x64/bin/node"

  def ensure!
    install_node unless node_installed?
    install_binstub
    "bin/node --version"
  end

  private

  def install_node
    system("mkdir tmp && wget -cO- https://nodejs.org/dist/#{NODE_VERSION}/node-#{NODE_VERSION}-linux-x64.tar.xz | tar xJ -C tmp/")
  end

  def install_binstub
    system("cd bin && ln -fs ../#{NODE_PATH}")
  end

  def node_installed?
    File.exist?(NODE_PATH) && `#{NODE_PATH} --version`.chomp == NODE_VERSION
  end

  def binstub_installed?
    File.exist?("bin/node")
  end
end

