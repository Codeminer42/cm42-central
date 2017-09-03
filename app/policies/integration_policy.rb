class IntegrationPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if admin?
        current_project.integrations
      else
        Integration.none
      end
    end
  end
end
