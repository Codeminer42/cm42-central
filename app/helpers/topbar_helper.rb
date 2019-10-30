module TopbarHelper
  def topbar_link(*args)
    link_to_unless_current(*args) do
      link_to(args.first, '#', class: 'nav-current')
    end
  end

  def topbar_projects
    scope = policy_scope(Project)
            .joins(:teams)
            .where(teams: { id: current_team })
            .preload(:tag_group)
    scope.not_archived.order(:name).each do |project|
      yield project
    end
  end
end
