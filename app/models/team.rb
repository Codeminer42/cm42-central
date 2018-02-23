class Team < ApplicationRecord
  include Central::Support::TeamConcern::Associations
  include Central::Support::TeamConcern::Validations
  include Central::Support::TeamConcern::Scopes
  include Central::Support::TeamConcern::DomainValidator

  extend FriendlyId
  friendly_id :name, use: :slugged

  attachment :logo

  has_many :api_tokens
  has_many :tag_groups

  def to_param
    ::FriendlyId::Disabler.disabled? ? (id && id.to_s) : super
  end
end
