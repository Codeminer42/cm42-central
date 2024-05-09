module StoryOperations
  class Create
    include Operation

    def initialize(project:, story:, story_attrs:, current_user:)
      @project = project
      @story = story
      @story_attrs = story_attrs
      @note_attrs = (story_attrs.delete(:notes_attributes) || {}).fetch("0", {})
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield set_attrs
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

    attr_reader :project, :story, :story_attrs, :note_attrs, :current_user

    def set_attrs
      story.attributes = story_attrs
      story.project = project
      story.requested_by ||= current_user
      Success(story)
    end

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
      if note_attrs.present?
        NoteOperations::Create.call(
          story: story,
          note_attrs: note_attrs,
          current_user: current_user
        )
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
