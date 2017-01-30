class SessionsController < Devise::SessionsController
  def current
    render json: current_user
  end
end
