require 'capybara/rspec'
require 'capybara-screenshot/rspec' unless ENV["CI"]
require 'selenium-webdriver'

Capybara.register_driver :chrome do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    "goog:chromeOptions" => {
      args: %w[no-sandbox headless disable-popup-blocking disable-gpu disable-infobars window-size=1280,1024]
    }
  )

  client = Selenium::WebDriver::Remote::Http::Default.new(read_timeout: 120)

  Capybara::Selenium::Driver.new(
    app,
    browser: :chrome,
    capabilities: capabilities,
    http_client: client
  )
end

unless ENV["CI"]
  Capybara::Screenshot.register_driver :chrome do |driver, path|
    driver.save_screenshot(path)
  end
end

Capybara.default_driver = :chrome
Capybara.javascript_driver = :chrome
Capybara.server = :puma, { Silent: true }
