class IterationsController < ApplicationController
  def show
    authorize project
    iteration =
      IterationOperations::Read.call(start_date: params.require(:start_date).to_date,
                                     end_date: params.require(:end_date).to_date,
                                     project: project)

    render json: iteration
  end

  private

  def project
    policy_scope(Project).friendly.find(params[:id])
  end
end
