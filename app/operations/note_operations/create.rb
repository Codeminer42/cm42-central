module NoteOperations
  class Create
    include Operation

    def initialize(story:, note_attrs:, current_user:, note: nil)
      @story = story
      @note_attrs = note_attrs
      @note = note || story.notes.build
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield set_attrs
        yield save_note
        if note.saved_change_to_story_id? || note.smtp_id.blank?
          yield create_changesets
          yield notify_users
          yield create_activity
        end
        Success(note)
      end
    end

    private

    attr_reader :story, :note_attrs, :note, :current_user

    def set_attrs
      note.attributes = note_attrs.merge({
        story: story,
        user: current_user,
      })
      Success note
    end

    def save_note
      # wrap in transaction to ensure it actually exists in the db before shipping it off to sidekiq in #deliver_later
      story.transaction do
        if note.save
          Success(note)
        else
          Failure(note)
        end
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
