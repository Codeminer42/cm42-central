FactoryBot.define do
  factory :attachinary_file, class: Attachinary::File do
    public_id { 'public_id' }
    version { Time.now.to_i }
    format { 'png' }
    resource_type { 'image' }
    attachinariable_id { nil }
  end
end
