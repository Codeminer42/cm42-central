# frozen_string_literal: true

ReactOnRails.configure do |config|
  # This app still uses Vite for client bundles, so React on Rails only
  # provides the Rails-side mounting contract for the migrated slice.
  config.auto_load_bundle = false
  config.prerender = false
end
