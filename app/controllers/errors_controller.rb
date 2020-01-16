class ErrorsController < ActionController::Base
  def not_found
    options = [session[:locale], current_user&.locale, 'en']
    I18n.locale = (options & I18n.available_locales.map(&:to_s)).first

    render 'errors/not_found', status: 404
  end
end
