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
    def permitted_project_ids
      teams_projects_ids = current_user.teams.map(&:projects).flatten.pluck(:id)
      user_projects_ids  = current_user.projects.pluck(:id)
      teams_projects_ids | user_projects_ids
    end

    def resolve
      if root?
        Project.all
      elsif admin?
        Project.where(id: permitted_project_ids)
      else
        return Project.none unless current_team
        current_user.projects.not_archived
      end
    end
  end
end
