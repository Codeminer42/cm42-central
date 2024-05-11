FactoryBot.define do
  factory :comment do |n|
    n.body { 'Test comment' }
    n.association :story
    n.association :user

    trait :without_user do
      user { nil }
    end
  end
end
