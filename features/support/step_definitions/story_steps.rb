Given "the {string} project has the following stories:" do |project_name, table|
  project = Project.find_by_name!(project_name)
  table.create! Story do
    default(:project) { project }
    rename :type => :story_type
  end
end

Given "the {string} story has the following notes:" do |story_name, table|
  table.create! Note do
    field(:story) { Story.find_by!(title: story_name) }
    field(:user) { |value| User.find_by!(initials: value) }
  end
end

When "I open the {string} story" do |name|
  find(".story:has(.toggle-story:not(:checked))", text: name).click
end

Then "I should see the following new story form:" do |table|
  table.diff! "#new_story_new_story"
end

Then "I should see the following {string} story form:" do |story_name, table|
  id = Story.find_by!(title: story_name).id
  table.diff! "#story_#{id}_edit_story_#{id}"
end

Then "I should see the following notes:" do |table|
  actual = all(".notelist .note").map do |note|
    [note.find(".note_note"), *note.all("span")].map(&:text)
  end
  table.diff! actual
end
