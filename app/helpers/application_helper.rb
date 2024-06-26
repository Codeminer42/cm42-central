module ApplicationHelper
  def global_alert
    return if ENV['GLOBAL_ALERT_TEXT'].blank?
    content_tag(
      :div,
      ENV['GLOBAL_ALERT_TEXT'],
      class: 'global-alert'
    )
  end

  def cookie_check_box id, options={}
    checked = options.fetch(:checked) { cookies[id].to_s == "true" }
    tag.input **options.merge({
      id:,
      checked:,
      type: "checkbox",
      data: { controller: "cookie-check-box" },
    })
  end
end
