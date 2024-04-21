Rails.application.config.after_initialize do
  Bullet.enable = true
  Bullet.bullet_logger = true
  Bullet.console = true
  Bullet.rails_logger = true
  Bullet.add_footer = true
end if Rails.env.development?
