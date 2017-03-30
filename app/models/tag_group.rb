class TagGroup < ActiveRecord::Base
  has_many :projects
  belongs_to :team

  validates :name, presence: true, length: { maximum: 15 }
end
