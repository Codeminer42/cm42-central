class TaskSerializer
  def initialize(task)
    @task = task
  end

  def self.serialize(task)
    new(task).serialize
  end

  def serialize
    {
      id: task.id,
      story_id: task.story_id,
      name: task.name,
      done: task.done,
      created_at: task.created_at,
      updated_at: task.updated_at
    }
  end

  private

  attr_reader :task
end
