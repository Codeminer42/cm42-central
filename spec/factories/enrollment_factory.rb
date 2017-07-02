FactoryGirl.define do
  factory :enrollment do |e|
    e.association :team
    e.association :user
    is_admin false
  end
end
