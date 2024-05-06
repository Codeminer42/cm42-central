class RegistrationsController < Devise::RegistrationsController
  before_action :set_resource_locale, only: :create
  before_action :check_registration_enabled, only: %i[new create]
  before_action :devise_params
  after_action :reset_locale, only: :update

  def tour
    @user = User.find(params[:id])
    if @user.update(user_params)
      render json: @user, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def reset_tour
    @user = User.find(params[:id])
    if @user.update(user_params)
      redirect_to :back, flash: { notice: t('reset_tour_success') }
    else
      redirect_to :back, flash: { error: t('reset_tour_fail') }
    end
  end

  private

  def user_params
    params.require(:user).permit(:finished_tour)
  end

  protected

  def after_inactive_sign_up_path_for(resource)
    new_session_path(resource)
  end

  def check_registration_enabled
    return unless Fulcrum::Application.config.fulcrum.disable_registration

    render_404
  end

  def devise_params
    devise_parameter_sanitizer.permit(:sign_up) do |u|
      u.permit(:email, :name, :initials, :username)
    end
    devise_parameter_sanitizer.permit(:account_update) do |u|
      u.permit(:email, :password, :password_confirmation, :remember_me,
               :name, :initials, :username, :email_delivery, :email_acceptance,
               :email_rejection, :locale, :time_zone, :current_password)
    end
  end

  def set_resource_locale
    return unless resource
    resource.locale = if session[:locale]
                        session[:locale]
                      else
                        I18n.locale
                      end
  end

  def reset_locale
    session[:locale] = nil
  end
end
