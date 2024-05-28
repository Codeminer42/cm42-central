Given "the {string} story has the following comments:" do |story_name, table|
  table.create! Comment do
    field(:story) { Story.find_by!(title: story_name) }
    field(:user) { |value| User.find_by!(initials: value) }
  end
end

Then "I should see the following comments:" do |table|
  page.document.synchronize errors: page.driver.invalid_element_errors + [Capybara::ElementNotFound, Cucumber::MultilineArgument::DataTable::Different] do
    table.diff! actual_comments
  end
end

Then "I should see no comments" do
  page.document.synchronize errors: page.driver.invalid_element_errors + [Capybara::ElementNotFound] do
    expect(actual_comments).to be_empty
  end
end

def actual_comments
  table = all(".commentlist .comment").map do |comment|
    [
      comment.find(".comment_body"),
      comment.first("span"),
      comment.find(".attachments"),
    ].map(&:text)
  end
  normalize_table(table)
end

