require 'capybara/rspec'
require 'capybara-screenshot/rspec'
require 'selenium-webdriver'

Capybara.register_driver :chrome do |app|
  args = %w[no-sandbox headless disable-popup-blocking disable-gpu window-size=1280,1024]
  options = Selenium::WebDriver::Chrome::Options.new(args: args)

  Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
end

Capybara.javascript_driver = :chrome

Capybara::Screenshot.register_driver :chrome do |driver, path|
  driver.save_screenshot(path)
end

Capybara.default_max_wait_time = 100

Capybara.javascript_driver = :chrome
