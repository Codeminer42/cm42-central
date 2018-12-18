class StorySerializer
  def initialize(story)
    @story = story
  end

  def self.serialize(story)
    new(story).serialize
  end

  def serialize
    {
      id: story.id,
      title: story.title,
      description: story.description,
      estimate: story.estimate,
      story_type: story.story_type,
      state: story.state,
      accepted_at: story.accepted_at,
      requested_by_id: story.requested_by_id,
      owned_by_id: story.owned_by_id,
      project_id: story.project_id,
      created_at: story.created_at,
      updated_at: story.updated_at,
      position: story.position,
      labels: story.labels,
      requested_by_name: story.requested_by_name,
      owned_by_name: story.owned_by_name,
      owned_by_initials: story.owned_by_initials,
      release_date: story.release_date,
      delivered_at: story.delivered_at,
      errors: story.errors,
      notes: notes,
      documents: story.documents,
      tasks: tasks
    }
  end

  private

  attr_reader :story

  def notes
    story.notes.map { |note| NoteSerializer.serialize(note) }
  end

  def tasks
    story.tasks.map { |task| TaskSerializer.serialize(task) }
  end
end
