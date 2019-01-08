FactoryBot.define do
  factory :task do |t|
    t.name { 'Test task' }
    t.association :story
  end
end
