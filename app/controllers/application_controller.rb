class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true

  include Pundit::Authorization
  include SidebarController
  include Renderers::CSV

  before_action :authenticate_user!, unless: :devise_controller?
  before_action :check_team_presence, if: :need_check_team?
  before_action :set_locale
  before_action :set_layout_settings
  around_action :user_time_zone, if: :current_user

  after_action :verify_authorized, except: [:index], if: :must_pundit?
  after_action :verify_policy_scoped, only: [:index], if: :must_pundit?

  rescue_from ActiveRecord::RecordNotFound, with: :render_404
  rescue_from Pundit::NotAuthorizedError,   with: :user_not_authorized

  protected

  def render_404
    respond_to do |format|
      format.html do
        if current_user
          redirect_to(request.referer || root_path, alert: I18n.t('not_found'))
        else
          render 'errors/not_found', status: 404
        end
      end
      format.xml { render nothing: true, status: '404' }
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
    PunditContext.new(current_team, current_user, current_project: @project, current_story: @story)
  end
  helper_method :pundit_user

  def current_team
    @current_team ||= Team.not_archived.find_by(slug: session[:current_team_slug])
  end
  helper_method :current_team

  def update_current_team
    @current_team = current_user.team_from_project(@project)
    session[:current_team_slug] = @current_team.slug
  end

  def after_sign_in_path_for(resource)
    return super if resource.is_a?(AdminUser)
    if resource.authy_enabled && resource.authy_id.blank?
      return public_send("#{resource_name}_enable_authy_path")
    end

    set_current_team_if_single

    return teams_url if session[:current_team_slug].blank?
    super
  end

  def check_team_presence
    set_current_team_if_single

    redirect_to teams_url if current_team.blank?
  end

  def set_current_team_if_single
    user_teams = current_user.teams.not_archived
    return if user_teams.size != 1

    session[:current_team_slug] = user_teams.first.slug
  end

  def must_pundit?
    !devise_controller? && self.class.module_parent != Manage
  end

  def set_layout_settings
    @layout_settings_default = { fluid: false }.freeze
    @layout_settings = @layout_settings_default.dup
  end

  def need_check_team?
    current_user.present? && !devise_controller?
  end

  def show_recaptcha?
    ENV.fetch('ENABLE_RECAPTCHA', false)
  end
  helper_method :show_recaptcha?
end
