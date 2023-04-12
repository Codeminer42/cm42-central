module Base
  class ActivityRecording
    def self.create_activity(model, current_user)
      Activity.create(
        project: fetch_project(model),
        user: current_user,
        action: self.class.name.split('::').last.downcase,
        subject: model
      )
    end

    private

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
  end
end