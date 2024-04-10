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

    has_many :teams
  end
end

