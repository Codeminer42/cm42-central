require 'dry/monads/result'
require 'dry/matcher/result_matcher'

class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true

  include Pundit::Authorization
  include SidebarController

  before_action :authenticate_user!, unless: ->(c) { c.devise_controller? || c.try(:active_admin_root?) }
  before_action :set_locale
  before_action :set_layout_settings
  around_action :user_time_zone, if: :current_user

  after_action :verify_authorized, except: [:index], if: :must_pundit?
  after_action :verify_policy_scoped, only: [:index], if: :must_pundit?

  # rescue_from ActiveRecord::RecordNotFound, with: :render_404
  # rescue_from Pundit::NotAuthorizedError,   with: :user_not_authorized

  protected

  def render_404
    if current_user
      redirect_to(request.referer || root_path, alert: I18n.t('not_found'))
    else
      render 'errors/not_found', status: 404
    end
  end

  def set_locale
    options = [session[:locale], current_user&.locale, 'en']
    I18n.locale = (options & I18n.available_locales.map(&:to_s)).first
  end

  def user_time_zone(&block)
    Time.use_zone(current_user.time_zone, &block)
  end

  def user_not_authorized
    flash[:error] = t('users.You are not authorized to perform this action')
    redirect_to request.headers['Referer'] || root_path
  end

  def pundit_user
    PunditContext.new(current_project, current_user, current_story: @story)
  end
  helper_method :pundit_user

  def current_project
    slug = params[:project_id] || session[:current_project_slug]
    @current_project ||= Project.not_archived.find_by(slug: slug)
  end
  helper_method :current_project

  def after_sign_in_path_for(resource)
    return super if resource.is_a?(AdminUser)

    return projects_url if session[:current_project_slug].blank?
    super
  end

  def must_pundit?
    !devise_controller? && self.class.module_parent != Manage
  end

  def set_layout_settings
    @layout_settings_default = { fluid: false }.freeze
    @layout_settings = @layout_settings_default.dup
  end

  def match_result(result)
    Dry::Matcher::ResultMatcher.call(result) { |on| yield on }
  end
end
