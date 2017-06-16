class TeamPolicy < ApplicationPolicy
  def index?
    true
  end

  def switch?
    true
  end

  def create?
    true
  end

  def update?
    is_admin?
  end

  def destroy?
    is_admin?
  end

  def manage_users?
    is_admin?
  end

  def new_enrollment?
    manage_users?
  end

  def create_enrollment?
    manage_users?
  end

  class Scope < Scope
    def resolve
      if is_root?
        Team
      elsif is_admin?
        Team.not_archived.where(id: current_team.id)
      else
        Team.none
      end
    end
  end
end
