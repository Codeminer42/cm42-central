module Base
  class ActivityRecording
    def self.create_activity(model, current_user, action)
      Array(model).map do |record|
        Activity.create(
          project: fetch_project(record),
          user: current_user,
          action: action,
          subject: record
        )
      end
    end

    def self.fetch_project(model)
      case model
      when Project
        model
      when Story
        model.project
      when Note, Task
        model.story.project
      end
    end

    private_class_method :fetch_project
  end
end
