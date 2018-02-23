module BaseOperations
  module ActivityRecording
    def fetch_project(record)
      case record
      when Project
        record
      when Story
        record.project
      when Note, Task
        record.story.project
      end
    end

    def create_activity
      Array(model).map do |record|
        Activity.create(
          project: fetch_project(record),
          user: current_user,
          action: self.class.name.split('::').last.downcase,
          subject: record
        )
      end
    end
  end
end
