Given "the {string} story has the following notes:" do |story_name, table|
  table.create! Note do
    field(:story) { Story.find_by!(title: story_name) }
    field(:user) { |value| User.find_by!(initials: value) }
  end
end

Then "I should see the following notes:" do |table|
  page.document.synchronize errors: page.driver.invalid_element_errors + [Capybara::ElementNotFound, Cucumber::MultilineArgument::DataTable::Different] do
    table.diff! actual_notes
  end
end

Then "I should see no notes" do
  expect(actual_notes).to be_empty
end

def actual_notes
  page.document.synchronize do
    table = all(".notelist .note").map do |note|
      [
        note.find(".note_note"),
        note.first("span"),
        note.find(".attachments"),
      ].map(&:text)
    end
    normalize_table(table)
  end
end

