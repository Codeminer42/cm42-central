module ApplicationHelper
  def global_alert
    return if ENV['GLOBAL_ALERT_TEXT'].blank?
    content_tag(
      :div,
      ENV['GLOBAL_ALERT_TEXT'],
      class: 'global-alert'
    )
  end
end
