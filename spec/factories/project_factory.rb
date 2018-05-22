FactoryGirl.define do
  factory :project do |p|
    p.name 'Test Project'
    p.start_date { Time.current }
    p.association :tag_group
  end

  trait :with_past_iteration do
    created_at { Time.current.days_ago(10) }
    start_date { Time.current.days_ago(10) }
  end

  trait :with_month_ago do
    created_at { Time.current.months_ago(1) }
    start_date { Time.current.months_ago(1) }
  end
end
