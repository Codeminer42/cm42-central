desc 'Populate new position column'
task populate_newposition: :environment do
  puts "RUNNING TASK: populate_newposition\n\n"

  def update_column(stories)
    new_position = 1
    stories.each_with_index do |story|
      story.update_column(:new_position, new_position)
      new_position += 1
    end
    puts "✓ Updated #{stories.length} stories.\n\n"
  end

  Project.find_each do |project|
    puts 'Updating icebox column...'
    update_column(project.stories.icebox.order(:position))
    puts 'Updating backlog column...'
    update_column(project.stories.backlog.order(:position))
    puts 'Updating todo column...'
    update_column(project.stories.todo.order(:position))
    puts 'Updating done column...'
    update_column(project.stories.done.order(:position))
  end

  puts 'Task done.'
end
