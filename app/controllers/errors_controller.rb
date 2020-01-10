class ErrorsController < ActionController::Base
  def not_found
    render 'errors/not_found', status: 404
  end
end
