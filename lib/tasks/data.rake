task :fix_story_positions => :environment do
  Project.find_each do |project|
    accepted_stories = project.stories.accepted.order(:accepted_at)

    current_iteration = project.iteration_service.backlog_iterations.first
    stories_accepted_this_iteration = project.stories.accepted_between(current_iteration.start_date, current_iteration.start_date + 1.week).order(:accepted_at)
    current_stories = project.stories.where(accepted_at: nil).where.not(state: :unscheduled).order(:position)
    icebox_stories = project.stories.chilly_bin.order(:position)

    collections = [
      accepted_stories,
      stories_accepted_this_iteration + current_stories + icebox_stories,
    ].each do |collection|
      collection.each.with_index do |story, index|
        story.update_column :position, index + 1
      end
    end
  end
end
