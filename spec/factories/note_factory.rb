FactoryGirl.define do
  factory :note do |n|
    n.note        'Test note'
    n.association :story
    n.association :user
  end
end
