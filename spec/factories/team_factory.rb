FactoryGirl.define do
  factory :team do |t|
    t.sequence(:name) {|n| "Team #{n}"}
  end
end
