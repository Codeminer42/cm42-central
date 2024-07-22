namespace :data do
  task :import_other_attachments => :environment do
    PivotalProject.find_each do |pivotal_project|
      pivotal_project.stories_attributes.each do |attrs|
        attrs["comments"].each do |comment_attrs|
          comment_attrs["attachments"].each do |attachment_attrs|
            if attachment_attrs["kind"] != "file_attachment"
              puts attrs["name"]
              puts attrs["created_at"]
              puts attachment_attrs["kind"]
            end
          end
        end
      end
    end
  end

  task :move_story_to_project => :environment do
    story_ids = [1530, 1531, 1532]
    project_id = 2
    Story.where(id: story_ids).each do |story|
      story.update!(project_id: project_id, position: :last, positioning_column: "#todo", state: "started")
      Activity.where(subject: [story, *story.comments]).each do |activity|
        activity.update_columns(project_id: project_id, updated_at: Time.zone.now)
      end
    end
  end

  task :backfill_comment_creation_activities => :environment do
    Activity.where(subject_type: "Comment", subject_changes: {}).find_each do |activity|
      next unless subject = activity.subject rescue nil
      subject_changes = subject.attributes.reduce({}) do |attrs, (key, value)|
        next attrs if value.nil?
        attrs.merge key.to_s => [nil, value]
      end
      activity.update_column :subject_changes, subject_changes
    end
  end

  task :fix_comment_story_links => :environment do
    Project.find_each do |project|
      project.comments.where("body REGEXP '#\\\\d{2,}\\\\b'").find_each do |comment|
        puts comment.body
        comment.body.gsub!(/#\d{2,}\b/) do |match|
          puts match
          url = "https://tracker.botandrose.com/projects/#{project.slug}#story-#{match[1..]}"
          puts "Replace with #{url}? (y/N)"
          if STDIN.gets.chomp == "y"
            puts "Replacing!"
            url
          else
            puts "Skipping..."
            match
          end
        end
        comment.save!
        puts ("-" * 80)
      end
    end
  end

  task :sorting_sanity => :environment do
    Story.where(positioning_column: "#todo", state: "unstarted").find_each do |story|
      story.update_columns positioning_column: story.column
    end
    Story.touch_all
    Project.touch_all
  end

  task :rename_chilly_bin_to_icebox => :environment do
    Story.where(positioning_column: "#chilly_bin").update_all(positioning_column: "#icebox")
  end

  task :rename_in_progress_to_todo => :environment do
    Story.where(positioning_column: "#in_progress").update_all(positioning_column: "#todo")
  end


  task :fix_positioning => :environment do
    project = Project.first
    stories = project.current_todo.stories.to_a + project.current_unstarted.stories.to_a
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
