FactoryBot.define do
  factory :tag_group do |t|
    t.name { 'my-tag' }
    t.description { 'awesome tag' }
    t.bg_color { '#FFFFFF' }
  end
end
