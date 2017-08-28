FactoryGirl.define do
  factory :membership do |m|
    m.association :project
    m.association :user
  end
end
