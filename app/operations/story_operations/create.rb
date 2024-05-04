module StoryOperations
  class Create
    include Operation

    def initialize(story:, current_user:)
      @story = story
      @story.notes.last&.user = current_user
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield save_story
        yield save_note

        yield create_changesets
        yield create_activity
        yield refresh_other_users

        yield notify_users

        Success(story)
      end
    end

    private

    attr_reader :story, :current_user

    def save_story
      # wrap in transaction to ensure it actually exists in the db before shipping it off to sidekiq in #deliver_later
      story.transaction do
        if story.save
          Success(story)
        else
          Failure(story)
        end
      end
    end

    def save_note
      if note = story.notes.last
        NoteOperations::Create.call(note: story.notes.last, current_user: current_user)
      end
      Success(story)
    end

    def create_changesets
      story.changesets.create
      Success(story)
    end

    def notify_users
      emails = story.project.users.where.not(id: current_user.id).pluck(:email)
      emails.each do |email|
        Notifications.new_story(email, story, current_user).deliver_later
      end
      Success(story)
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        story,
        current_user: current_user,
        action: 'create'
      )
    end

    def refresh_other_users
      story.project.broadcast_refresh_later
      Success story
    end
  end
end
