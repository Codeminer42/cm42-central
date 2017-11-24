class IntegrationsController < ApplicationController
  before_action :set_project, :set_integrations
  before_action -> { define_sidebar :project_settings }, only: %i[index]

  respond_to :html, :json

  def index
    @layout_settings[:fluid] = true
    respond_with(@integrations)
  end

  def create
    build_integration

    if @project.integrations.find_by(kind: @integration.kind)
      flash[:alert] = "#{@integration.kind} is already configured for this project"
    elsif @integration.save
      flash[:notice] = "#{@integration.kind} was added to this project"
    else
      render 'index'
      return
    end

    redirect_to project_integrations_url(@project)
  end

  def destroy
    @integration = policy_scope(Integration).find(params[:id])
    authorize @integration
    @project.integrations.delete(@integration)
    redirect_to project_integrations_url(@project)
  end

  private

  def set_project
    @project = policy_scope(Project).friendly.find(params[:project_id])
  end

  def build_integration
    @integration = policy_scope(Integration).build(kind: params[:integration][:kind])
    authorize @integration
    @integration.data = params[:integration][:data]
  end

  def set_integrations
    @integrations ||= begin
      current_integrations = @project.integrations
      missing_integrations = Integration::VALID_INTEGRATIONS - current_integrations.pluck(:kind)

      current_integrations + missing_integrations.map { |i| Integration.new kind: i }
    end
  end
end
