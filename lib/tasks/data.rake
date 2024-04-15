namespace :data do
  task :fix_story_positions => :environment do
    Project.find_each do |project|
      accepted_stories = project.stories.accepted.order(:accepted_at)
      current_stories = project.stories.where(accepted_at: nil).where.not(state: :unscheduled).order(:position)
      icebox_stories = project.stories.chilly_bin.order(:position)

      collections = [
        accepted_stories,
        current_stories,
        icebox_stories,
      ].each do |collection|
        collection.each.with_index do |story, index|
          story.update_columns({
            positioning_column: story.send(:set_positioning_column),
            position: index + 1,
          })
        end
      end
    end
  end
end
