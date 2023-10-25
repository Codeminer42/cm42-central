module Beta
  module ProjectBoardOperations
    class Read
      include Operation

      def initialize(project_id:, current_user:, current_flow: nil, projects_scope: Project)
        @project_id = project_id
        @current_user = current_user
        @current_flow = current_flow
        @projects_scope = projects_scope
      end

      def call
        project_board = yield create_project_board

        Success(project_board)
      rescue ActiveRecord::RecordNotFound => e
        Failure(e)
      end

      private

      attr_reader :project_id, :current_user, :current_flow, :projects_scope

      def create_project_board
        project_users = project.users

        project_board_params = stories_and_past_iterations.merge(
          project: project,
          users: project_users,
          current_user: current_user,
          current_flow: current_flow,
          default_flow: default_flow,
          labels: project_labels
        )

        project_board = ::ProjectBoard.new(project_board_params)

        Success(project_board)
      end

      def stories_and_past_iterations
        read_all_result = yield ::StoryOperations::ReadAll.call(project: project)
        read_all_result[:stories] = read_all_result.delete(:active_stories)
        read_all_result
      end

      def project_labels
        possibly_duplicated_labels = project.stories.map(&:labels).reject(&:blank?)
        uniq_labels = possibly_duplicated_labels.join(',').split(',').uniq.join(',')
        uniq_labels
      end

      def project
        @project ||= current_user
                     .projects
                     .friendly
                     .preload(:users, stories: %i[notes tasks])
                     .find(project_id)
      end

      def default_flow
        Fulcrum::Application.config.fulcrum.column_order
      end
    end
  end
end
