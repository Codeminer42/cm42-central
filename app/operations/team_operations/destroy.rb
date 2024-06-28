module TeamOperations
  class Destroy
    include Operation

    def initialize(team:, current_user:)
      @team = team
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield delete_team

        Success(team)
      end
    rescue
      Failure(team)
    end

    private

    attr_reader :team, :current_user

    def delete_team
      Success(team.update(archived_at: Time.current))
    end
  end
end
