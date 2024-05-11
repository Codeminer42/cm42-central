class Comment < ActiveRecord::Base
  belongs_to :user
  belongs_to :story, touch: true

  has_many_attached :attachments

  before_save :cache_user_name

  validates :body, presence: true

  delegate :project, to: :story

  private

  def cache_user_name
    self.user_name = user.name if user.present?
  end
end
