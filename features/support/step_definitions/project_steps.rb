Given "the following projects exist:" do |table|
  table.create! Project do
    has_many :users, name_field: :email
    default(:start_date) { Time.zone.now }
    default(:point_scale) { "none" }
  end
end

Given "I am on the {string} project page" do |project_name|
  project = Project.find_by_name!(project_name)
  visit "/projects/#{project.to_param}"
end

Then "I should see the following project board:" do |table|
  page.document.synchronize 5.seconds, errors: page.driver.invalid_element_errors + [Capybara::ElementNotFound, Cucumber::MultilineArgument::DataTable::Different] do
    puts all(".story-col").length # WTF why does this fix things
    actual = all(".story-col").map do |column|
      [column.find(".toggle-title").text, *stories_for(column)]
    end
    actual = normalize_table(actual).transpose
    table.diff! actual
  end
end

def stories_for column
  column.all(".story").map do |story|
    initial = (story["data-story-type"] || "").capitalize[0]
    name_and_owner = story.all(".story-title").map(&:text).join(" ")
    actions = story.all(".transition").map(&:value)
    [
      initial,
      name_and_owner,
      *actions,
    ].compact.join(" ")
  end
end

