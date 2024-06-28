module TeamOperations
  class Update
    include Operation

    def initialize(team:, team_attrs:, current_user:)
      @team = team
      @team_attrs = team_attrs
      @current_user = current_user
    end

    def call
      team.attributes = team_attrs
      if team.save
        Success(team)
      else
        Failure(team)
      end
    end

    private

    attr_reader :team, :team_attrs, :current_user
  end
end
