class StoryPolicy < ApplicationPolicy
  def index?
    return false if guest?
    admin? || project_member?
  end

  def show?
    return false if guest?
    admin? || project_member? && current_project.stories.find_by(id: record.id)
  end

  def create?
    return false if guest?
    admin? || project_member?
  end

  def update?
    return false if guest?
    admin? || project_member?
  end

  def transition?
    update?
  end

  alias story? show?

  class Scope < Scope
    def resolve
      if admin?
        current_project.stories
      elsif project_member?
        current_project.stories
      else
        Story.none
      end
    end
  end
end
