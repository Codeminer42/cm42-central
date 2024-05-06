require "timecop"

Given "today is {string}" do |time|
  Timecop.freeze(time)
end

When "I wait for {int} seconds" do |seconds|
  sleep seconds
end

When /^(.*) with a (\d+) second timeout$/ do |step_fragment, timeout|
  Capybara.using_wait_time timeout.to_i do
    step step_fragment
  end
end

After do |scenario|
  Timecop.return
end

