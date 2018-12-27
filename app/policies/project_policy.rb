class ProjectPolicy < ApplicationPolicy
  def show?
    admin? || current_user.projects.find_by(id: record.id)
  end

  def reports?
    admin? || project_member?
  end

  def import?
    admin? && project_owner?
  end

  def join?
    return false if project_member? || guest?
    true
  end

  def archive?
    !record.archived && import?
  end

  def unarchive?
    record.archived && import?
  end

  alias archived? update?
  alias import_upload? import?
  alias destroy? import?
  alias share? import?
  alias unshare? share?
  alias transfer? share?
  alias ownership? share?

  class Scope < Scope
    def resolve
      if root?
        Project.all
      elsif admin?
        current_team.projects
      else
        return Project.none unless current_team
        current_user.projects.not_archived.where(id: current_team.projects.pluck(:id))
      end
    end
  end
end
