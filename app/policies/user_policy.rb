class UserPolicy < ApplicationPolicy
  def index?
    admin? || project_member?
  end

  def show?
    admin? || (project_member? && current_project.users.find_by(id: record.id))
  end

  def create?
    admin?
  end

  def update?
    admin? || himself?
  end

  def destroy?
    admin? || himself?
  end

  def himself?
    record == current_user
  end

  def create_membership?
    admin?
  end

  class Scope < Scope
    def resolve
      if admin?
        User.all
      elsif project_member?
        current_project.users
      else
        User.none
      end
    end
  end
end
