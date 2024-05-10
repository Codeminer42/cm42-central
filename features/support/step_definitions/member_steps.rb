Then "I should see the following project members:" do |table|
  actual = normalize_table(all("#project-members .user-card").map do |row|
    row.all("span").map(&:text)
  end)
  table.diff! actual
end

Then "I should see the following available members:" do |table|
  actual = normalize_table(all("#available-users .user-card").map do |row|
    row.all("span").map(&:text)
  end)
  table.diff! actual
end


