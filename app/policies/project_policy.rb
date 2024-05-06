class ProjectPolicy < ApplicationPolicy
  def show?
    admin? || current_user.projects.find_by(id: record.id)
  end

  def reports?
    admin? || project_member?
  end

  def import?
    admin? && record.persisted?
  end

  alias archive? import?
  alias unarchive? import?
  alias archived? update?
  alias import_upload? import?
  alias destroy? import?

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
