FactoryBot.define do
  factory :changeset do |c|
    c.association :story
    c.association :project
  end
end
