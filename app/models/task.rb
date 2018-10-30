class Task < ApplicationRecord
  belongs_to :story

  validates :name, presence: true

  before_destroy { |record| raise ActiveRecord::ReadOnlyRecord if record.readonly? }

  def readonly?
    return false if destroyed_by_association
    story.readonly?
  end
end
