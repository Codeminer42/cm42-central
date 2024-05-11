class Task < ActiveRecord::Base
  belongs_to :story

  validates :name, presence: true

  private

  def status
    done ? 'completed' : 'not_completed'
  end
end
