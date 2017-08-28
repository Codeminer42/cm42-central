class StoryPolicy < ApplicationPolicy
  def index?
    admin? || project_member?
  end

  def show?
    admin? || project_member? && current_project.stories.find_by(id: record.id)
  end

  def create?
    admin? || project_member?
  end

  def update?
    admin? || project_member?
  end

  def done?
    update?
  end

  def backlog?
    update?
  end

  def in_progress?
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
