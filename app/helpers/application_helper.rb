module ApplicationHelper
  def team_logo(image_path)
    cl_image_tag(image_path,
      width: 32,
      height: 32,
      crop: :fill,
      radius: 5,
      border: '1px_solid_black')
  end

  CLOUDINARY_JS_CONFIG_PARAMS = %i[
    api_key
    cloud_name
    private_cdn
    secure_distribution
    cdn_subdomain
  ]

  def cloudinary_config
    params = {}

    CLOUDINARY_JS_CONFIG_PARAMS.each do |param|
      value = Cloudinary.config.send(param)
      params[param] = value unless value.nil?
    end

    content_tag(
      :script,
      "window.CLOUDINARY_CONFIG = #{params.to_json};".html_safe,
      :type=>'text/javascript'
    )
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
