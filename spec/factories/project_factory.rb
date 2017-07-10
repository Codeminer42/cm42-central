FactoryGirl.define do
  factory :project do |p|
    p.name 'Test Project'
    p.start_date { Time.current }
    p.association :tag_group
  end
end
