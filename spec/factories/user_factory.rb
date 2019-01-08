FactoryBot.define do
  factory :user do |u|
    u.sequence(:name) { |n| "User #{n}" }
    u.sequence(:username) { |n| "username #{n}" }
    u.sequence(:initials) { |n| "U#{n}" }
    u.sequence(:email) { |n| "user#{n}@example.com" }
    u.password { 'password' }
    u.password_confirmation { 'password' }
    u.locale { 'en' }
    u.time_zone { 'Brasilia' }
    u.finished_tour { true }
    u.after(:build, &:confirm)

    trait :with_team do
      after(:build) { |object| object.enrollments.create(team: create(:team), is_admin: false) }
    end

    trait :with_team_and_is_admin do
      after(:build) { |object| object.enrollments.create(team: create(:team), is_admin: true) }
    end

    trait :with_archived_team_and_is_admin do
      after(:build) { |object| object.enrollments.create(team: create(:team, archived_at: Time.current), is_admin: true) }
    end
  end

  factory :unconfirmed_user, class: User do |u|
    u.sequence(:name) { |n| "Unconfirmed User #{n}" }
    u.sequence(:username) { |n| "testuser#{n}" }
    u.sequence(:initials) { |n| "U#{n}" }
    u.sequence(:email) { |n| "unconfirmed_user#{n}@example.com" }
  end
end
