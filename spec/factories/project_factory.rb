FactoryGirl.define do
  factory :project do |p|
    p.name 'Test Project'
    p.start_date { Time.current }
    p.association :tag_group
  end

  trait :with_past_date do
    start_date { Time.current.days_ago(10) }
  end
end
