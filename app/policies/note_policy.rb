class NotePolicy < StoryPolicy
  def show?
    return false if guest?
    admin? || project_member?
  end

  class Scope < Scope
    def resolve
      if admin?
        Note.all
      elsif story_member?
        current_story.notes
      else
        Note.none
      end
    end
  end
end
