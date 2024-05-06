FactoryBot.define do
  factory :user do |u|
    u.sequence(:name) { |n| "User #{n}" }
    u.sequence(:username) { |n| "username #{n}" }
    u.sequence(:initials) { |n| "U#{n}" }
    u.sequence(:email) { |n| "user#{n}@example.com" }
    u.password { 'password' }
    u.password_confirmation { 'password' }
    u.locale { 'en' }
    u.time_zone { Time.zone.name }
    u.finished_tour { true }
    u.after(:build, &:confirm)

    trait :admin do
      after(:build) { |object| object.update!(admin: true) }
    end
  end

  factory :unconfirmed_user, class: User do |u|
    u.sequence(:name) { |n| "Unconfirmed User #{n}" }
    u.sequence(:username) { |n| "testuser#{n}" }
    u.sequence(:initials) { |n| "U#{n}" }
    u.sequence(:email) { |n| "unconfirmed_user#{n}@example.com" }
  end
end
