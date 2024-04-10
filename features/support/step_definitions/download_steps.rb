require "csv"

Then "I should download a file named: {string}" do |filename|
  page.driver.downloads[filename]
end

Then "I should download a CSV named {string} with the following contents:" do |filename, table|
  file = page.driver.downloads[filename]
  actual = CSV.parse(file.read).to_a
  table.diff! actual
end

