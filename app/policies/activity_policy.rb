class ActivityPolicy < ApplicationPolicy
  def index?
    is_admin? || is_project_member?
  end

  class Scope < Scope
    def resolve
      return Activity.none unless is_admin? || is_project_member?

      Activity.all
    end
  end
end
