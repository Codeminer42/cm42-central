module ProjectOperations
  class Destroy
    include Operation

    def initialize(project:, current_user:)
      @project = project
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield destroy_project
        yield create_activity

        Success(project)
      end
    rescue
      Failure(project)
    end

    private

    attr_reader :project, :project_attrs, :current_user

    def destroy_project
      if Rails.env.production?
        Success(project.delay.destroy)
      else
        Success(project.destroy)
      end
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        project,
        current_user: current_user,
        action: 'destroy'
      )
    end
  end
end
