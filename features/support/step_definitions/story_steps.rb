Given "the {string} project has the following stories:" do |project_name, table|
  project = Project.find_by_name!(project_name)
  table.create! Story do
    default(:project) { project }
    rename :type => :story_type
  end
end

When /^I open (the ".+?" story)$/ do |locator|
  element_for(locator).click
end

Then "I should see the following new story form:" do |table|
  table.diff! "#new_story"
end

Then "I should see the following {string} story form:" do |story_name, table|
  id = Story.find_by!(title: story_name).id
  table.diff! "#edit_story_#{id}"
end

