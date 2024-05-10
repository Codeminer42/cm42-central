Then "I should download a file named: {string}" do |filename|
  page.driver.downloads[filename]
end

