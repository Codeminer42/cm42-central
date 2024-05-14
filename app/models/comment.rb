class Comment < ActiveRecord::Base
  belongs_to :user
  belongs_to :story, touch: true

  has_many_attached :attachments

  before_save :cache_user_name

  delegate :project, to: :story

  validate :body_or_attachment_present

  private

  def body_or_attachment_present
    if body.blank? && attachments.none?
      errors.add :base, "must have either a body or an attachment"
    end
  end

  def cache_user_name
    self.user_name = user.name if user.present?
  end
end
