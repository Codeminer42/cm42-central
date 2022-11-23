class ProjectBoardsSerializer
    def self.collapsed_stories(stories)
        stories.map do |story|
          {
            id: story["id"],
            title: story["title"],
            description: story["description"],
            estimate: story["estimate"],
            story_type: story["story_type"],
            state: story["state"],
            requested_by_name: story["requested_by_name"],
            owned_by_initials: story["owned_by_initials"],
            project_id: story["project_id"]
          }
        end
    end
  end
  