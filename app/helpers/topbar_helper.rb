module TopbarHelper
  def topbar_link(*args)
    link_to_unless_current(*args) do
      link_to(args.first, '#', class: 'nav-current')
    end
  end

  def topbar_projects
    scope = Project.projects_joined_by_team(policy_scope(Project), current_team)

    scope.not_archived.order(:name).each do |project|
      yield project
    end
  end
end
