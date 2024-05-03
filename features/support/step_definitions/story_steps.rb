Given "the {string} project has the following stories:" do |project_name, table|
  project = Project.find_by_name!(project_name)
  table.create! Story do
    default(:project) { project }
    rename :type => :story_type
    belongs_to :requested_by, User, name_field: :username
  end
end

Given "the {string} story has the following notes:" do |story_name, table|
  table.create! Note do
    field(:story) { Story.find_by!(title: story_name) }
    field(:user) { |value| User.find_by!(initials: value) }
  end
end

When "I open the {string} story" do |name|
  find(
    "#in_progress .story:has(.toggle-story:not(:checked)),
     #chilly_bin .story:has(.toggle-story:not(:checked))",
    text: name,
  ).click
end

Then "I should see the following new story form:" do |table|
  table.diff! "#new_story_new_story"
end

Then "I should see the following {string} story form:" do |story_name, table|
  id = Story.find_by!(title: story_name).id
  table.diff! "#story_#{id}_edit_story_#{id}"
end

Then "I should see the following notes:" do |table|
  table.diff! actual_notes
end

Then "I should see no notes" do
  expect(actual_notes).to be_empty
end

def actual_notes
  page.document.synchronize do
    table = all(".notelist .note").map do |note|
      [
        note.find(".note_note"),
        *note.all("span"),
        *note.all(".attachment"),
      ].map(&:text)
    end
    normalize_table(table)
  end
end
