ActiveRecord::Base.transaction do
  user = User.create!(
    name: 'Foo Bar',
    initials: 'FB',
    username: 'foobar',
    email: 'foo@bar.com',
    password: 'asdfasdf'
  )

  user.confirm!

  project = Project.create!(
    name: 'Test Project',
    users: [user],
    start_date: Time.current.months_ago(2)
  )

  project.stories.create!(
    title: 'A user should be able to create features',
    story_type: 'feature',
    requested_by: user,
    labels: 'features'
  )

  project.stories.create!(
    title: 'A user should be able to create bugs',
    story_type: 'bug',
    requested_by: user,
    labels: 'bugs'
  )

  project.stories.create!(
    title: 'A user should be able to create chores',
    story_type: 'chore',
    requested_by: user,
    labels: 'chores'
  )

  project.stories.create!(
    title: 'A user should be able to create releases',
    story_type: 'release',
    requested_by: user,
    labels: 'releases'
  )

  project.stories.create!(
    title: 'A user should be able to estimate features',
    story_type: 'feature',
    requested_by: user,
    estimate: 1,
    labels: 'estimates,features'
  )

  3.times do |n|
    project.stories.create!(
      title: 'A project should have some past iterations',
      story_type: 'feature',
      state: 'accepted',
      accepted_at:  Time.current.weeks_ago(n + 1),
      started_at: Time.current.weeks_ago(n + 1),
      requested_by: user,
      estimate: 3,
      labels: 'features'
    )
  end

  60.times do |n|
    random_date = [*1...6].sample
    project.stories.create!(
      title: "Story #{n}",
      story_type: 'feature',
      state: 'accepted',
      accepted_at:  Time.current.weeks_ago(random_date),
      started_at: Time.current.weeks_ago(random_date + 1),
      requested_by: user,
      estimate: [*1...4].sample,
      labels: 'features'
    )
  end

  2.times do |n|
    project.stories.first.notes.create!(
      note: "This is comment number #{n + 1}",
      user: user
    )
  end

  archived_team = Team.create! name: 'Archive Team', archived_at: Time.current
  archived_team.enrollments.create! user: user, is_admin: true

  team = Team.create! name: 'Default'
  team.enrollments.create! user: user, is_admin: true
  team.ownerships.create(project: project, is_owner: true)

  AdminUser.create!(
    email: 'admin@example.com',
    password: 'password',
    password_confirmation: 'password'
  )
end
