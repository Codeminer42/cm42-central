FactoryBot.define do
  factory :activity do |a|
    a.association :project
    a.association :user
    action { 'create' }
  end
end
