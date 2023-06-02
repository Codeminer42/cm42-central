module TeamOperations
  class Destroy < BaseOperations::Destroy
    def create_activity
      # bypass (no current_project)
    end

    protected

    def operate!
      # do not delete from the database, just mark as archived
      model.update!(archived_at: Time.current)
    end
  end

  class Unarchive
    def self.call(*args)
      new(*args).run
    end

    def initialize(model)
      @model = model
    end

    def run
      @model.update!(archived_at: nil)
    end
  end
end
