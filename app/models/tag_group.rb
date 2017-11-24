class TagGroup < ApplicationRecord
  has_many :projects
  belongs_to :team

  validates :name, presence: true, length: { maximum: 15 }

  def bg_color=(value)
    self[:bg_color] = convert_bg_color_hash(value)
  end

  private

  def convert_bg_color_hash(value)
    RGBUtils::RGB.new(JSON.parse(value)).to_hex
  rescue
    value
  end
end
