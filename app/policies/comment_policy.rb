class CommentPolicy < StoryPolicy
  def show?
    return false if guest?
    admin? || project_member?
  end

  class Scope < Scope
    def resolve
      if admin?
        Comment.all
      elsif project_member?
        current_project.comments
      else
        Comment.none
      end
    end
  end
end
