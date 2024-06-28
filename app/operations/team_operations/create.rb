module TeamOperations
  class Create
    include Operation

    def initialize(team:, current_user:)
      @team = team
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield save_team
        yield create_enrollment

        Success(team)
      end
    rescue
      Failure(team)
    end

    private

    attr_reader :team, :current_user

    def save_team
      if team.save
        Success(team)
      else
        Failure(team)
      end
    end

    def create_enrollment
      return Success(team) if current_user.blank?
      Success(team.enrollments.create(user: current_user, is_admin: true))
    end
  end
end
