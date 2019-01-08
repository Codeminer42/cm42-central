if Rails.env.production?
  Devise::Async.enabled = true
end
