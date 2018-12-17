class NoteSerializer
  def initialize(note)
    @note = note
  end

  def self.serialize(note)
    new(note).serialize
  end

  def serialize
    {
      id: note.id,
      note: note.note,
      user_id: note.user_id,
      story_id: note.story_id,
      created_at: note.created_at,
      updated_at: note.updated_at,
      user_name: note.user_name,
      errors: note.errors
    }
  end

  private

  attr_reader :note
end
