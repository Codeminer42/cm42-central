Given "the following projects exist:" do |table|
  table.create! Project do
    has_many :users, name_field: :email
    default(:start_date) { Time.zone.now }

    field :teams do |names|
      names.split(", ").map do |name|
        Team.where(name: name).first_or_create!
      end
    end
  end
end

Given "I am on the {string} project page" do |project_name|
  project = Project.find_by_name!(project_name)
  visit "/projects/#{project.to_param}"
end

Then "I should see the following project board:" do |table|
  page.document.synchronize errors: page.driver.invalid_element_errors + [Capybara::ElementNotFound, Cucumber::MultilineArgument::DataTable::Different] do
    puts "TRYING"
    actual = normalize([
      ["Done", *stories_for("#done")],
      ["Current", *stories_for("#in_progress")],
      ["Icebox", *stories_for("#chilly_bin")],
    ])
    table.diff! actual.transpose
  end
end

def normalize rows
  max = rows.map(&:length).max
  rows.each do |row|
    row.to_a << "" while row.length < max
  end
end

def stories_for column_id
  find(column_id).all(".story").map do |story|
    initial = story["data-story-type"].capitalize[0]
    name_and_owner = story.all(".story-title").map(&:text).join(" ")
    actions = story.all(".transition").map(&:value)
    [
      initial,
      name_and_owner,
      *actions,
    ].compact.join(" ")
  end
end

