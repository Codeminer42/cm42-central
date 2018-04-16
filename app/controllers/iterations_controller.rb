class IterationsController < ApplicationController
  def show
    iteration =
      IterationOperations::Read.call(start_date: params.require[:start_date],
                                     end_date: params.require[:end_date],
                                     project: project)

    render json: iteration
  end

  private

  def project
    policy_scope(Project).friendly.find(params[:id])
  end
end
