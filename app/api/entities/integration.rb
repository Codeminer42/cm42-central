class Entities::Integration < Entities::BaseEntity
  expose :id
  expose :project_id
  expose :kind
  expose :data

  with_options(format_with: :iso_timestamp) do
    expose :created_at, if: ->(i, _o) { i.created_at.present? }
    expose :updated_at, if: ->(i, _o) { i.updated_at.present? }
  end
end
