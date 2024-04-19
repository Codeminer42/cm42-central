module ApplicationHelper
  def team_logo(team)
    if team.logo.attached?
      image_tag(team.logo.variant(:thumb),
        width: 32,
        height: 32,
        crop: :fill,
        radius: 5,
        border: '1px_solid_black')
    end
  end

  def global_alert
    return if ENV['GLOBAL_ALERT_TEXT'].blank?
    content_tag(
      :div,
      ENV['GLOBAL_ALERT_TEXT'],
      class: 'global-alert'
    )
  end
end
