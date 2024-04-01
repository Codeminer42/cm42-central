require 'vcr'
require 'webmock'

VCR.configure do |config|
  config.hook_into :faraday, :webmock
  config.cassette_library_dir = 'fixtures/vcr_cassettes'
  config.ignore_localhost = true
  config.ignore_request do |request|
    host = URI(request.uri).host
    %w[googlechromelabs.github.io storage.googleapis.com].include?(host)
  end
  config.configure_rspec_metadata!

  config.default_cassette_options = {
    match_requests_on: %i[uri method body]
  }
end
