class Entities::Project < Entities::BaseEntity
  expose :id
  expose :name
  expose :slug
  expose :point_scale
  expose :iteration_start_day
  expose :iteration_length
  expose :default_velocity
  expose :velocity, if: { type: :full }
  expose :volatility, if: { type: :full }
  expose :teams, using: Entities::Team
  expose :integrations, using: Entities::Integration, if: { type: :full }
  expose :mail_reports

  with_options(format_with: :iso_timestamp) do
    expose :created_at, if: ->(project, _) { project.created_at.present? }
    expose :start_date, if: ->(project, _) { project.start_date.present? }
  end

  private

  def velocity
    iteration_service.velocity
  end

  def volatility
    iteration_service.volatility
  end

  def iteration_service
    @iteration_service ||= begin
      Central::Support::IterationService.new(
        object,
        current_time: Time.current
      )
    end
  end

  def teams
    object.teams
  end
end
