module ProjectOperations
  class Create
    include Operation

    def initialize(project:, current_user:, current_team:)
      @project = project
      @current_user = current_user
      @current_team = current_team
    end

    def call
      ActiveRecord::Base.transaction do
        yield save_project
        yield create_activity
        yield create_ownership

        Success(project)
      end
    rescue
      Failure(project)
    end

    private

    attr_reader :project, :current_user, :current_team

    def save_project
      if project.save
        Success(project)
      else
        Failure(project)
      end
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        project,
        current_user: current_user,
        action: 'create'
      )
    end

    def create_ownership
      Success(current_team.ownerships.create!(project: project, is_owner: true))
    end
  end
end
