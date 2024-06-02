Given "the {string} project has the following stories:" do |project_name, table|
  project = Project.find_by_name!(project_name)
  table.create! Story do
    default(:project) { project }
    rename :type => :story_type
    belongs_to :requested_by, User, name_field: :username
    belongs_to({ :owner => :owned_by }, User, name_field: :username)
  end
end

When "I open the {string} story" do |name|
  find(
    "#todo .story:has(.toggle-story:not(:checked)),
     #icebox .story:has(.toggle-story:not(:checked))",
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

# FIXME push upstream into chop?
Chop::Form::Select.include Module.new {
  def get_value
    if selected_value = field.value
      field.find("option[value='#{selected_value}']").text
    end
  end
}
