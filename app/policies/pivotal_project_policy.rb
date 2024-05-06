class PivotalProjectPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if admin?
        PivotalProject.all
      else
        PivotalProject.none
      end
    end
  end
end

