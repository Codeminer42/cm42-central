module ProjectOperations
  class Update
    include Operation

    def initialize(project:, project_attrs:, current_user:)
      @project = project
      @project_attrs = project_attrs
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield save_project
        yield truncate_story_points
        yield create_activity

        Success(project)
      end
    rescue
      Failure(project)
    end

    private

    attr_reader :project, :project_attrs, :current_user

    def save_project
      project.attributes = project_attrs
      if project.save
        Success(project)
      else
        Failure(project)
      end
    end

    def truncate_story_points
      Success StoryOperations::TruncatePoints.call(
        project: project
      )
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        project,
        current_user: current_user,
        action: 'update'
      )
    end
  end
end
