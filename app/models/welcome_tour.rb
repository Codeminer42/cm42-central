class WelcomeTour
  STEPS = [
    {
      title: "welcome_tour.create_team.title",
      text: 'welcome_tour.create_team.text',
      attachTo: '[data-step="create-team"] bottom',
      done: false
    },
    {
      title: 'welcome_tour.create_project.title',
      text: 'welcome_tour.create_project.text',
      attachTo: '[data-step="create-project"] bottom',
      done: false
    },
    {
      title: 'welcome_tour.project_activity.title',
      text: 'welcome_tour.project_activity.text',
      attachTo: '[data-step="activity"] bottom',
      done: false
    },
    {
      title: 'welcome_tour.create_story.title',
      text: 'welcome_tour.create_story.text',
      attachTo: '[data-step="add-story"] bottom',
      done: false
    },
    {
      title: 'welcome_tour.chilly_bin.title',
      text: 'welcome_tour.chilly_bin.text',
      attachTo: '[data-step="chilly-bin"] bottom',
      done: false
    },
    {
      title: 'welcome_tour.backlog.title',
      text: 'welcome_tour.backlog.text',
      attachTo: '[data-step="backlog"] bottom',
      done: false
    },
    {
      title: 'welcome_tour.in_progress.title',
      text: 'welcome_tour.in_progress.text',
      attachTo: '[data-step="in-progress"] bottom',
      done: false
    },
    {
      title: 'welcome_tour.done.title',
      text: 'welcome_tour.done.text',
      attachTo: '[data-step="done"] bottom',
      done: false
    },
    {
      title: 'welcome_tour.project_velocity.title',
      text: 'welcome_tour.project_velocity.text',
      attachTo: '[data-step="velocity"] bottom',
      done: false
    },
    {
      title: 'welcome_tour.members.title',
      text: 'welcome_tour.members.text',
      attachTo: '[data-step="members"] bottom',
      done: false
    }
  ]

  def set_user_steps user
    user.tour_steps = STEPS.to_json
  end
end
