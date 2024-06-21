require "timecop"

Given "today is {string}" do |time|
  Timecop.freeze(time)
end

When "I wait for {int} seconds" do |seconds|
  sleep seconds
end

When /^(.*) with a (\d+) second timeout$/ do |step_fragment, timeout|
  begin
    original = page.driver.timeout
    page.driver.timeout = timeout.to_i
    Capybara.using_wait_time timeout.to_i do
      step step_fragment
    end
  ensure
    page.driver.timeout = original
  end
end

After do |scenario|
  Timecop.return
end

