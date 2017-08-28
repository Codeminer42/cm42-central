FactoryGirl.define do
  factory :ownership do |o|
    o.association :team
    o.association :project
  end
end
