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
      project_board.stories.map { |story| StorySerializer.serialize(story) }
    end
  end
end
