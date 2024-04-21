class Task < ApplicationRecord
  include ActiveModel::Serializers::JSON
  self.include_root_in_json = false

  belongs_to :story

  validates :name, presence: true

  def to_csv
    [name, status]
  end

  private

  def status
    done ? 'completed' : 'not_completed'
  end
end
