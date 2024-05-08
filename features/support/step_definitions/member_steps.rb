Then "I should see the following project members:" do |table|
  actual = all("#project-members .user-description").map do |row|
    row.all("span").map(&:text)
  end
  table.diff! actual
end

Then "I should see the following available members:" do |table|
  actual = all("#available-users .user-description").map do |row|
    row.all("span").map(&:text)
  end
  table.diff! actual
end


