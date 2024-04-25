class StoryChangesNotificationsChecker
  def initialize(story)
    @story = story
  end

  def can_notify?
    changed? && notifications_enabled? && allowed_to_user?
  end

  private

  def changed?
    story.state_previously_changed?
  end

  def notifications_enabled?
    !story.suppress_notifications
  end

  def allowed_to_user?
    changed_by_different_user? && responsible_email_enabled?
  end

  def changed_by_different_user?
    story.acting_user.present? && responsible.present? && story.acting_user != responsible
  end

  def responsible
    case story.state
    when 'delivered'
      story.requested_by
    when 'accepted', 'rejected'
      story.owned_by
    end
  end

  def responsible_email_enabled?
    case story.state
    when 'started', 'delivered'
      responsible.email_delivery?
    when 'accepted'
      responsible.email_acceptance?
    when 'rejected'
      responsible.email_rejection?
    else
      false
    end
  end

  attr_reader :story
end
