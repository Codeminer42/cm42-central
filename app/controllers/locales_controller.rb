class LocalesController < ApplicationController
  skip_before_action :check_team_presence

  options = { class: 'locale-change-option' }
  LOCALES = [
    ['English', 'en', options],
    ['Español', 'es', options],
    ['Português', 'pt-BR', options]
  ].freeze

  skip_before_action :authenticate_user!, only: [:update]
  skip_after_action :verify_authorized, only: [:update]
  skip_after_action :verify_policy_scoped, only: [:update]

  def update
    if LOCALES.any? { |locale| locale.include?(params[:locale]) }
      session[:locale] = params[:locale]
    end
    redirect_to request.referer || root_path
  end
end
