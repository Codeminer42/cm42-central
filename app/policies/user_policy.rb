class UserPolicy < ApplicationPolicy
  def index?
    is_admin? || is_project_member?
  end

  def show?
    is_admin? || (is_project_member? && current_project.users.find_by_id(record.id))
  end

  def create?
    is_admin?
  end

  def update?
    is_himself?
  end

  def destroy?
    is_admin? || is_himself?
  end

  def is_himself?
    record == current_user
  end

  def enrollment?
    create?
  end

  def create_enrollment?
    is_admin?
  end

  class Scope < Scope
    def resolve
      if is_root?
        User
      elsif is_admin?
        if current_project
          current_project.users
        else
          # Admin::UsersController
          current_team.users.all
        end
      elsif is_project_member?
        current_project.users
      else
        User.none
      end
    end
  end
end
