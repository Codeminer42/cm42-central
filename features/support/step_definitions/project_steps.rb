Given "the following projects exist:" do |table|
  table.create! Project do
    has_many :teams
    has_many :users, name_field: :email
    default(:start_date) { Time.zone.now }
  end
end

Given "I am on the {string} project page" do |project_name|
  project = Project.find_by_name!(project_name)
  visit "/projects/#{project.to_param}"
end

Then "I should see the following project board:" do |table|
  actual = normalize([
    ["Done", *stories_for("#done")],
    ["Current", *stories_for("#in_progress")],
    ["Icebox", *stories_for("#chilly_bin")],
  ])
  table.diff! actual.transpose
end

def normalize rows
  max = rows.map(&:length).max
  rows.each do |row|
    row.to_a << "" while row.length < max
  end
end

def stories_for column_id
  all("#{column_id} .story").map do |story|
    initial = story["data-story-type"].capitalize[0]
    name_and_owner = story.find(".story-title").text
    actions = story.all(".transition").map(&:text)
    [
      initial,
      name_and_owner,
      *actions,
    ].compact.join(" ")
  end
end

