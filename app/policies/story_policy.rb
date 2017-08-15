class StoryPolicy < ApplicationPolicy
  def index?
    (is_admin? || is_project_member?) && !is_guest?
  end

  def show?
    is_admin? || is_project_member? && current_project.stories.find_by_id(record.id) && !is_guest?
  end

  def create?
    (is_admin? || is_project_member?) && !is_guest?
  end

  def update?
    (is_admin? || is_project_member?) && !is_guest?
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

  alias_method :story?, :show?

  class Scope < Scope
    def resolve
      if is_admin?
        current_project.stories
      else
        if is_project_member?
          current_project.stories
        else
          Story.none
        end
      end
    end
  end
end
