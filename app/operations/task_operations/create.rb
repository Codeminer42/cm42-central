module TaskOperations
  class Create
    include Operation

    def initialize(task:, current_user:)
      @task = task
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield save_task
        yield create_activity

        Success(task)
      end
    rescue
      Failure(task)
    end

    private

    attr_reader :task, :current_user

    def save_task
      if task.save
        Success(task)
      else
        Failure(task)
      end
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        task,
        current_user: current_user,
        action: 'create'
      )
    end
  end
end
