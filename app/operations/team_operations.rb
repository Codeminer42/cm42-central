module TeamOperations
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
