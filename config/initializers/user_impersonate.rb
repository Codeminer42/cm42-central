module UserImpersonate
  class Engine < Rails::Engine
    # Devise user model
    config.user_class = 'User'

    # User model lookup method
    config.user_finder = 'find'

    # Staff user model lookup method
    config.staff_finder = 'find'

    # User model primary key attribute
    config.user_id_column = 'id'

    # User model name attribute used for search
    # Usage: User.where('#{user_name_column} like ?', '%#{params[:search]}%')
    config.user_name_column = 'name'

    # User model staff attribute
    config.user_is_staff_method = 'staff?'

    # Redirect to this path when entering impersonate mode
    config.redirect_on_impersonate = '/'

    # Redirect to this path when leaving impersonate mode
    config.redirect_on_revert = '/manage/users'

    # Devise method used to sign user in
    config.sign_in_user_method = 'sign_in'

    config.staff_class = 'User'

    # For Active Admin "AdminUser" model, use 'authenticate_admin_user!'
    config.authenticate_user_method = 'authenticate_user!'

    # For Active Admin "AdminUser" model, use 'current_admin_user'
    config.current_staff = 'current_user'
  end
end

Rails.application.reloader.to_prepare do
  UserImpersonate::ImpersonateController.class_eval do
    # Ignore user authentication and Pundit authorization
    skip_before_action :authenticate_user!
    skip_after_action :verify_authorized
  end
end
