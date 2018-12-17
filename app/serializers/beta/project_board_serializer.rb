module Beta
  class ProjectBoardSerializer
    def initialize(project_board)
      @project_board = project_board
    end

    def self.serialize(project_board)
      new(project_board).serialize
    end

    def serialize
      {
        past_iterations: project_board.past_iterations,
        project: project_board.project,
        stories: stories,
        users: project_board.users,
        current_user: project_board.current_user,
        current_flow: project_board.current_flow,
        default_flow: project_board.default_flow
      }.as_json(root: false)
    end

    private

    attr_reader :project_board

    def stories
      project_board.stories.map do |story|
        {
          id: story.id,
          title: story.title,
          description: story.description,
          estimate: story.estimate,
          story_type: story.story_type,
          state: story.state,
          accepted_at: story.accepted_at,
          requested_by_id: story.requested_by_id,
          owned_by_id: story.owned_by_id,
          project_id: story.project_id,
          created_at: story.created_at,
          updated_at: story.updated_at,
          position: story.position,
          labels: story.labels,
          requested_by_name: story.requested_by_name,
          owned_by_name: story.owned_by_name,
          owned_by_initials: story.owned_by_initials,
          release_date: story.release_date,
          delivered_at: story.delivered_at,
          errors: story.errors,
          notes: found_notes(story),
          documents: story.documents,
          tasks: story.tasks
        }
      end
    end

    def found_notes(story)
      [] if story.notes.empty?
      story.notes.map do |note|
        {
          id: note.id,
          note: note.note,
          user_id: note.user_id,
          story_id: note.story_id,
          created_at: note.created_at,
          updated_at: note.updated_at,
          user_name: note.user_name,
          errors: note.errors
        }
      end
    end
  end
end
