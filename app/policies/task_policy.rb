class TaskPolicy < StoryPolicy
  def show?
    current_story.tasks.find_by(id: record.id)
  end

  class Scope < Scope
    def resolve
      if admin?
        current_story.tasks
      elsif story_member?
        current_story.tasks
      else
        Task.none
      end
    end
  end
end
