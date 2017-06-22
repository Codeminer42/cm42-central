class UserPolicy < ApplicationPolicy
  def index?
    admin? || project_member?
  end

  def show?
    admin? || (project_member? && current_project.users.find_by_id(record.id))
  end

  def create?
    admin?
  end

  def update?
    himself?
  end

  def destroy?
    admin? || himself?
  end

  def himself?
    record == current_user
  end

  def enrollment?
    create?
  end

  def create_enrollment?
    admin?
  end

  class Scope < Scope
    def resolve
      if root?
        User
      elsif admin?
        if current_project
          current_project.users
        else
          # Admin::UsersController
          current_team.users.all
        end
      elsif project_member?
        current_project.users
      else
        User.none
      end
    end
  end
end
