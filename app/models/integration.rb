class Integration < ApplicationRecord
  VALID_INTEGRATIONS = %w[discord mattermost slack gitlab].freeze

  belongs_to :project
  validates :project, presence: true
  validates :kind, inclusion: { in: VALID_INTEGRATIONS }, presence: true
  serialize :data, coder: JSON, type: Hash
  def data
    HashWithIndifferentAccess.new(super)
  end
end
