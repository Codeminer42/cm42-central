module SpecifiedYarn
  extend self

  YARN_VERSION = "v1.22.0"
  YARN_PATH = "tmp/yarn-#{YARN_VERSION}/bin/yarn.js"

  def ensure!
    install_yarn unless yarn_installed?
    install_binstub
    "bin/yarn install"
  end

  private

  def install_yarn
    system("wget -cO- https://github.com/yarnpkg/yarn/releases/download/#{YARN_VERSION}/yarn-#{YARN_VERSION}.tar.gz | tar -xz -C tmp/")
  end

  def install_binstub
    system("cd bin && ln -fs ../#{YARN_PATH}")
  end

  def yarn_installed?
    File.exist?(YARN_PATH) && `bin/node #{YARN_PATH} --version`.chomp == YARN_VERSION[1..-1]
  end

  def binstub_installed?
    File.exist?("bin/yarn")
  end
end

