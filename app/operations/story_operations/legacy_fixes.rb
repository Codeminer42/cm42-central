module StoryOperations
  module LegacyFixes
    def apply_fixes
      model.fix_project_start_date
      model.fix_story_accepted_at
      model.project.save! if model.project.start_date_previously_changed?
    end
  end
end
