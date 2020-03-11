class Beta::ProjectPolicy < ProjectPolicy
  def show?
    project_owner? || (current_user.projects.find_by(id: record.id) && current_user.miner?)
  end
end
