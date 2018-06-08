require 'base_operations/activity_recording'

module BaseOperations
  class Create
    include ActivityRecording
    IncompleteOperationError = Class.new(StandardError)

    def self.call(*args)
      new(*args).run
    end

    def initialize(model, current_user)
      @model = model
      @current_user = current_user
    end

    def run
      ActiveRecord::Base.transaction do
        before_save
        @operations = operate!
        after_save
      end
      raise IncompleteOperationError if Array(@operations).include?(false)
      create_activity
      return model
    rescue ActiveRecord::RecordInvalid, IncompleteOperationError
      return false
    end

    protected

    attr_reader :model, :current_user

    def before_save; end

    def after_save; end

    def operate!
      model.save!
    end
  end

  class Update < BaseOperations::Create
    def initialize(model, params, current_user)
      @params = params.to_hash
      super(model, current_user)
    end

    protected

    attr_reader :params

    def operate!
      model.attributes = params
      changes = model.changed_attributes
      model.save!
      model.instance_variable_set('@changed_attributes', changes)
    end
  end

  class UpdateAll < BaseOperations::Create
    def initialize(model, params, current_user)
      @params = params.to_hash
      super(model, current_user)
    end

    def self.name
      'update'
    end

    protected

    attr_reader :params

    def operate!
      model.map do |record|
        Update.call(record, params, current_user)
      end
    end
  end

  class Destroy < BaseOperations::Create
    protected

    def operate!
      model.destroy!
    end
  end

  class DestroyAll < BaseOperations::Create
    def self.name
      'destroy'
    end

    protected

    def operate!
      model.destroy_all
    end
  end
end
