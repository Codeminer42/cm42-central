class Entities::Story < Entities::BaseEntity
  expose :id
  expose :title
  expose :description
  expose :story_type
  expose :estimate
  expose :state
  expose :labels
  expose :requested_by_name
  expose :cycle_time
  expose :owned_by_name
  expose :owned_by_initials
  expose :accepted_by_name

  with_options(format_with: :iso_timestamp) do
    expose :created_at, if: ->(story, _) { story.created_at.present? }
    expose :started_at, if: ->(story, _) { story.started_at.present? }
    expose :accepted_at, if: ->(story, _) { story.accepted_at.present? }
  end
end
