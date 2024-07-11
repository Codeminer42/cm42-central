Given "the {string} story has the following comments:" do |story_name, table|
  table.create! Comment do
    field(:story) { Story.find_by!(title: story_name) }
    field(:user) { |value| User.find_by!(initials: value) }
  end
end

Then "I should see the following comments:" do |table|
  table.diff! ".commentlist"
end

Then "I should see no comments" do
  Chop.empty_table.diff! ".commentlist"
end

