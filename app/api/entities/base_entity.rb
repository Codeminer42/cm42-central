class Entities::BaseEntity < Grape::Entity
  format_with(:iso_timestamp, &:iso8601)
end
