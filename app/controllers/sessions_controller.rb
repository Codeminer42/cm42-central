class SessionsController < Devise::SessionsController
  def current
    if user_signed_in?
      render json: current_user, status: :ok
    else
      render json: {}, status: :unauthorized
    end
  end
end
