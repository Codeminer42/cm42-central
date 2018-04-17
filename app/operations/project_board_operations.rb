module ProjectBoardOperations
  class Read
    def self.call(*args)
      new(*args).run
    end

    def initialize(id, current_user, current_flow: nil, projects_scope: Project)
      @project_id = id
      @current_user = current_user
      @current_flow = current_flow
      @projects_scope = projects_scope
    end

    def run
      project = project
      users = project.users
      stories = project.stories

      project_board = ::ProjectBoard.new(
        project: project,
        users: users,
        stories: stories,
        current_user: @current_user,
        current_flow: @current_flow,
        default_flow: default_flow
      )

      OpenStruct.new(success?: true, data: project_board)
    rescue ActiveRecord::RecordNotFound => e
      OpenStruct.new(success?: false, error: e)
    end

    private

    def project
      @projects_scope
        .friendly
        .preload(:users, stories: %i[notes, document_files, tasks])
        .find(@project_id)
    end

    def default_flow
      Fulcrum::Application.config.fulcrum.column_order
    end
  end
end
