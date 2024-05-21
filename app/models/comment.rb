class Comment < ActiveRecord::Base
  belongs_to :user
  belongs_to :story, touch: true
  has_one :project, through: :story

  has_many_attached :attachments

  before_save :shorten_story_links
  before_save :cache_user_name

  validate :body_or_attachment_present

  private

  def body_or_attachment_present
    if body.blank? && attachments.none?
      errors.add :base, "must have either a body or an attachment"
    end
  end

  def shorten_story_links
    return unless body.present?
    body.gsub! %r{https?://[^/]+/projects/[^#]+#story-(\d+)} do
      "##{$1}"
    end
  end

  def cache_user_name
    self.user_name = user.name if user.present?
  end
end
