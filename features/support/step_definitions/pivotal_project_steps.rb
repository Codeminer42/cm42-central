Then "I should see the following importable projects:" do |table|
  actual = all(".pivotal-projects .project-title").map do |row|
    [row.text]
  end
  table.diff! actual
end


Then "I should see the following project import results:" do |table|
  table.diff! ".import-results"
end
