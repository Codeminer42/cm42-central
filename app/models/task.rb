class Task < ApplicationRecord
  belongs_to :story

  validates :name, presence: true

  before_destroy { |record| raise ActiveRecord::ReadOnlyRecord if record.readonly? }

  delegate :readonly?, to: :story
end
