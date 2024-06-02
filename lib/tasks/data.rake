namespace :data do
  task :rename_chilly_bin_to_icebox => :environment do
    Story.where(positioning_column: "#chilly_bin").update_all(positioning_column: "#icebox")
  end

  task :fix_positioning => :environment do
    project = Project.first
    stories = project.current_in_progress.stories.to_a + project.current_unstarted.stories.to_a
    stories.each.with_index(1) { |s,i| s.update position: i }
  end

  task :rename_notes_to_comments => :environment do
    [ 
      %w[active_storage_attachments record_type],
      %w[activities subject_type],
      %w[activities subject_destroyed_type],
    ].each do |table, field|
      ActiveRecord::Base.connection.execute <<~SQL
        UPDATE #{table} SET #{field}='Comment' WHERE #{field}='Note';
      SQL
    end
  end

  task :fix_story_positions => :environment do
    Project.find_each do |project|
      Story.find_each.with_index do |story, index|
        story.update_columns({
          positioning_column: story.calculate_positioning_column,
          position: index+1,
        })
      end
    end
  end
end
