Given "the following users exist:" do |table|
  table.create! User do
    default(:password) { "secretsecret" }
    default(:confirmed_at) { 100.years.ago }

    transformation do |attributes|
      username = attributes[:username] || attributes[:email].split("@").first
      attributes.merge(username: username)
    end

    after :projects do |user, attributes|
      projects = attributes[:projects].split(", ").map do |name|
        Project.where(name: name).first_or_create!({
          start_date: Time.zone.now,
          point_scale: "none",
        })
      end
      projects.each do |project|
        project.users << user
      end
    end
  end
end

