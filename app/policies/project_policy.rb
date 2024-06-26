class ProjectPolicy < ApplicationPolicy
  def show?
    admin? || current_user.projects.find_by(id: record.id)
  end

  alias done? show?
  alias accepted_search_results? show?

  def reports?
    admin? || project_member?
  end

  def archive?
    admin?
  end

  alias unarchive? archive?
  alias archived? archive?
  alias destroy? archive?

  class Scope < Scope
    def resolve
      if admin?
        Project.all
      else
        current_user.projects.not_archived
      end
    end
  end
end
