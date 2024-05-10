class NotePolicy < StoryPolicy
  def show?
    return false if guest?
    admin? || project_member?
  end

  class Scope < Scope
    def resolve
      if admin?
        Note.all
      elsif project_member?
        current_project.notes
      else
        Note.none
      end
    end
  end
end
