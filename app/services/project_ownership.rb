class ProjectOwnership
  def initialize(project, team, current_team, ownership_action)
    @project = project
    @team = team
    @current_team = current_team
    @ownership_action = ownership_action
  end

  def perform
    return false unless different_team?

    case ownership_action
    when 'share' then share
    when 'unshare' then unshare
    when 'transfer' then transfer
    end
  end

  def performed_action_message
    action = case ownership_action
             when 'share' then 'shared'
             when 'unshare' then 'unshared'
             when 'transfer' then 'transferred'
             end

    I18n.t("projects.project was successfully #{action}")
  end

  def transfer?
    ownership_action == 'transfer'
  end

  private

  def share
    team.ownerships.create(project: project, is_owner: false)
  end

  def unshare
    team.ownerships.where(project: project).delete_all
  end

  def transfer
    Project.transaction do
      remove_project_from_current_team
      add_project_to_new_team
    end
  end

  def different_team?
    team != current_team
  end

  def remove_project_from_current_team
    current_team.ownerships.where(project: project).delete_all
    project.memberships.delete_all
  end

  def add_project_to_new_team
    project.users << team_admin
    team.ownerships.create(project: project, is_owner: true)
  end

  def team_admin
    team_admin = team.enrollments.where(is_admin: true).first.try(:user)
    team_admin || raise(ActiveRecord::RecordNotFound, 'Team Administrator not found')
  end

  attr_reader :project, :team, :current_team, :ownership_action
end
