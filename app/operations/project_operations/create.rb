module ProjectOperations
  class Create
    include Operation

    def initialize(project:, current_user:)
      @project = project
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield save_project
        yield create_activity

        Success(project)
      end
    rescue
      Failure(project)
    end

    private

    attr_reader :project, :current_user

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
  end
end
