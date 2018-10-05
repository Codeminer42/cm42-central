module TeamOperations
  class Create < BaseOperations::Create
    def create_activity
      # bypass (no current_user)
    end

    protected

    def after_save
      return if current_user.blank?
      model.enrollments.create user: current_user, is_admin: true
    end
  end

  class Update < BaseOperations::Update
    def create_activity
      # bypass (no current_project)
    end
  end

  class Destroy < BaseOperations::Destroy
    def create_activity
      # bypass (no current_project)
    end

    protected

    def operate!
      # do not delete from the database, just mark as archived
      model.update_attributes!(archived_at: Time.current)
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
      @model.update_attributes!(archived_at: nil)
    end
  end
end
