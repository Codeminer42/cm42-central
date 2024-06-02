class WelcomeTour
  STEPS = [
    {
      title: 'welcome_tour.create_story.title',
      text: 'welcome_tour.create_story.text',
      attachTo: '[data-step="add-story"] bottom'
    },
    {
      title: 'welcome_tour.icebox.title',
      text: 'welcome_tour.icebox.text',
      attachTo: '[data-step="icebox"] bottom'
    },
    {
      title: 'welcome_tour.backlog.title',
      text: 'welcome_tour.backlog.text',
      attachTo: '[data-step="backlog"] bottom'
    },
    {
      title: 'welcome_tour.in_progress.title',
      text: 'welcome_tour.in_progress.text',
      attachTo: '[data-step="in-progress"] bottom'
    },
    {
      title: 'welcome_tour.done.title',
      text: 'welcome_tour.done.text',
      attachTo: '[data-step="done"] bottom'
    },
    {
      title: 'welcome_tour.project_velocity.title',
      text: 'welcome_tour.project_velocity.text',
      attachTo: '[data-step="velocity"] bottom'
    },
    {
      title: 'welcome_tour.members.title',
      text: 'welcome_tour.members.text',
      attachTo: '[data-step="members"] bottom'
    }
  ].freeze
end
