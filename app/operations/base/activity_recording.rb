module Base
  class ActivityRecording
    def self.create_activity(one_or_many_models, current_user:, action:)
      Array(one_or_many_models).map do |model|
        Activity.create!(
          project: fetch_project(model),
          user: current_user,
          action: action,
          subject: model
        )
      end
    end

    def self.fetch_project(model)
      case model
      when Project
        model
      when Story
        model.project
      when Comment, Task
        model.story.project
      end
    end

    private_class_method :fetch_project
  end
end
