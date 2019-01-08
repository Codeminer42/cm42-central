FactoryBot.define do
  factory :story do |s|
    s.title { 'Test story' }
    s.association :requested_by, factory: :user

    trait :with_project do
      after(:build) { |object| object.project = create(:project, users: [object.requested_by]) }
    end

    trait :with_activity do
      after(:create) do |object|
        create(:activity, subject: object, user: object.requested_by, project: object.project)
      end
    end

    trait :done do
      title { 'Done story' }
      state { 'accepted' }
      estimate { 8 }
      accepted_at { Time.current.days_ago(10) }
    end

    trait :active do
      title { 'Active story' }
      state { 'started' }
      started_at { Time.current.days_ago(2) }
    end
  end
end
