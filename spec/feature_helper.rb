require 'rails_helper'

RSpec.configure do |config|
  config.before(:suite) do
    `bundle exec rake assets:precompile`
    `bundle exec rake webpack:compile`
  end

  config.include Warden::Test::Helpers
end
