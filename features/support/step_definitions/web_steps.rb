Given "I am on the homepage" do
  visit "/"
end

When "I visit {string}" do |path|
  visit path
end

When "I blur" do
  execute_script "document.activeElement.blur()"
end

When "I follow {string}" do |link|
  click_link link
end

When "I follow and confirm {string}" do |link|
  accept_confirm { click_link link }
end

When "I press {string}" do |button|
  click_button button
end

When "I fill in {string} with {string}" do |field, value|
  fill_in field, with: value
end

When "I fill in the following form:" do |table|
  table.fill_in!
end

When "I choose {string}" do |field|
  choose field
end

When "I select {string} from {string}" do |value, field|
  select value, from: field
end

When "I check {string}" do |field|
  find_field(field).check
end

When "I uncheck {string}" do |field|
  find_field(field).uncheck
end

When "I attach {string} to {string}" do |path, field|
  attach_file field, Rails.root.join("features/support/fixtures/#{path}")
end

When /^I drag (the ".+?" .+?) (?:above|below) (the ".+?" .+?)$/ do |source, destination|
  # HACK CDP can't do HTML5 dnd so work around it instead
  source_id = element_for(source)[:"data-id"]
  destination_id = element_for(destination)[:"data-id"]
  execute_script "document.querySelector('[data-controller*=sortable]').sortable.drag(#{source_id.inspect}, #{destination_id.inspect})"

  # element_for(source).drag_to element_for(destination)
end

Then "I should not be able to follow {string}" do |link|
  expect { click_link link }.to raise_exception(Capybara::ElementNotFound)
end

Then "I should see {string}" do |text|
  expect(page).to have_content(text)
end

Then "I should not see {string}" do |text|
  expect(page).to_not have_content(text)
end

Then "I should see {string} as unlinked text" do |text|
  expect(page).to have_content(text)
  expect(page).to_not have_css("a", text: text)
end

Then "I should see the following form:" do |table|
  table.diff! "form"
end

Then "I should see {string} checked" do |field|
  expect(find_field(field)).to be_checked
end

Then "I should see {string} unchecked" do |field|
  expect(find_field(field)).to_not be_checked
end

Then "I should see {string} filled in with {string}" do |field, value|
  expect(find_field(field).value).to eq value
end

Then "I should be on {string}" do |path|
  expect(current_path).to eq path
end

