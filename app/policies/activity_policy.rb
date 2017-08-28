class ActivityPolicy < ApplicationPolicy
  def index?
    admin? || project_member?
  end

  class Scope < Scope
    def resolve
      return Activity.none unless admin? || project_member?

      Activity.all
    end
  end
end
