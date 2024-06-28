module TeamOperations
  class Unarchive
    include Operation

    def initialize(team:)
      @team = team
    end

    def call
      ActiveRecord::Base.transaction do
        yield unarchive_team

        Success(team)
      end
    rescue
      Failure(team)
    end

    private

    attr_reader :team

    def unarchive_team
      Success(team.update(archived_at: nil))
    end
  end
end
