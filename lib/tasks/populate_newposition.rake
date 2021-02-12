desc 'Populate new position column'
task populate_newposition: :environment do
  def update_column(stories)
    new_position = 1
    stories.each_with_index do |story|
      story.update_column(:new_position, new_position)
      new_position = new_position + 1
    end
  end

  Project.find_each do |project|
    update_column(project.stories.chilly_bin.order(:position))
    update_column(project.stories.backlog.order(:position))
    update_column(project.stories.in_progress.order(:position))
    update_column(project.stories.done.order(:position))
  end
end
