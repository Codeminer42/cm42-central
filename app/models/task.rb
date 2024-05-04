class Task < ApplicationRecord
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
