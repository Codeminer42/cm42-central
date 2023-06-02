module TeamOperations
  class Update
    include Operation

    def initialize(team:, team_attrs:, current_user:)
      @team = team
      @team_attrs = team_attrs
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield update_story

        Success(team)
      end
    rescue
      Failure(team)
    end

    private

    attr_reader :team, :team_attrs, :current_user

    def update_story
      team.attributes = team_attrs
      if team.save
        Success(team)
      else
        Failure(team)
      end
    end
  end
end
