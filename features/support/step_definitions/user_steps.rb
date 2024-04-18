Given "the following teams exist:" do |table|
  table.create! Team do
    has_many :projects
    has_many :users, name_field: :email
  end
end

Given "the following users exist:" do |table|
  table.create! User do
    default(:password) { "secretsecret" }
    default(:confirmed_at) { 100.years.ago }

    transformation do |attributes|
      attributes.merge(username: attributes[:email].split("@").first)
    end

    field :teams do |names|
      names.split(", ").map do |name|
        Team.where(name: name).first_or_create!
      end
    end

    after :projects do |user, attributes|
      projects = attributes[:projects].split(", ").map do |name|
        Project.where(name: name).first_or_create!({
          start_date: Time.zone.now,
        })
      end
      projects.each do |project|
        project.users << user
        project.teams += user.teams
      end
    end
  end
end

