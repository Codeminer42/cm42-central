module NoteOperations
  class Create
    include Operation

    def initialize(story:, note_attrs:, current_user:)
      @story = story
      @note_attrs = note_attrs.merge(user: current_user)
      @note = story.notes.build(@note_attrs)
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield save_note
        yield create_changesets
        yield notify_users
        yield create_activity

        Success(note)
      end
    end

    private

    attr_reader :story, :note_attrs, :note, :current_user

    def save_note
      if note.save
        Success(note)
      else
        Failure(note)
      end
    end

    def create_changesets
      story.changesets.create
      Success(note)
    end

    def notify_users
      Success UserNotification.notify_users(
        note: note,
        current_user: current_user,
      )
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        note,
        current_user: current_user,
        action: 'create'
      )
    end
  end
end
