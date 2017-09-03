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
    !project_member? && !guest?
  end

  alias archived? update?
  alias import_upload? import?
  alias archive? import?
  alias unarchive? archive?
  alias destroy? archive?
  alias share? archive?
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
