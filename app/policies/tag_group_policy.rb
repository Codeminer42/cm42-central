class TagGroupPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if admin?
        current_team.tag_groups
      else
        TagGroup.none
      end
    end
  end
end
