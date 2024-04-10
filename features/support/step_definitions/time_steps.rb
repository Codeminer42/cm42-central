require "timecop"

Given "today is {string}" do |time|
  Timecop.freeze(time)
end

When "I wait for {int} seconds" do |seconds|
  sleep seconds
end

After do |scenario|
  Timecop.return
end

