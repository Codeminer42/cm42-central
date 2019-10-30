module Beta
  module ProjectBoardOperations
    class Read
      def self.call(*args)
        new(*args).run
      end

      def initialize(current_user, project, current_flow: nil)
        @current_user = current_user
        @project = project
        @current_flow = current_flow
      end

      def run
        users = @project.users

        project_board_params = stories_and_past_iterations.merge(
          project: @project,
          users: users,
          current_user: @current_user,
          current_flow: @current_flow,
          default_flow: default_flow,
          labels: project_labels
        )

        project_board = ::ProjectBoard.new(project_board_params)

        OpenStruct.new(successful?: true, data: project_board)
      rescue ActiveRecord::RecordNotFound => e
        OpenStruct.new(successful?: false, error: e)
      end

      private

      def project_labels
        labels = @project.stories.map(&:labels).reject { |label| label.to_s.empty? }
        labels.join(',').split(',').uniq.join(',')
      end

      def stories_and_past_iterations
        read_all_response = ::StoryOperations::ReadAll.call(project: @project)
        read_all_response[:stories] = read_all_response.delete(:active_stories)
        read_all_response
      end

      def default_flow
        Fulcrum::Application.config.fulcrum.column_order
      end
    end
  end
end
