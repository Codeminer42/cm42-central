class NotePolicy < StoryPolicy
  def show?
    current_story.notes.find_by(id: record.id)
  end

  class Scope < Scope
    def resolve
      if admin?
        current_story.notes
      elsif story_member?
        current_story.notes
      else
        Note.none
      end
    end
  end
end
