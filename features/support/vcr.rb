require "vcr"

VCR.configure do |c|
  c.hook_into :webmock
  c.cassette_library_dir     = "features/support/cassettes"
  c.default_cassette_options = { record: :new_episodes }
  c.ignore_localhost = true
  c.ignore_hosts "chromedriver.storage.googleapis.com"
  c.preserve_exact_body_bytes { true }
end

VCR.cucumber_tags do |t|
  t.tag "@vcr", use_scenario_name: true
end

