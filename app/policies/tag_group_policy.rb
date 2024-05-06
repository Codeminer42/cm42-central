class TagGroupPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if admin?
        TagGroup.all
      else
        TagGroup.includes(:projects).where(projects: { id: current_project.id })
      end
    end
  end
end
