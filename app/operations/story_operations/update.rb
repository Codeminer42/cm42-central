module StoryOperations
  class Update
    include Operation

    def initialize(story:, data:, current_user:)
      @story = story
      @data = data
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield ensure_valid_state
        yield documents_attributes_changes
        yield update_story

        yield create_changesets
        yield apply_fixes

        yield notify_state_changed
        yield notify_users
        yield notify_changes

        yield create_activity

        Success(story)
      end
    rescue
      Failure(story)
    end

    private

    attr_reader :story, :data, :current_user

    def should_be_unscheduled?(estimate:, type:)
      Story.can_be_estimated?(type) && estimate.blank?
    end

    def ensure_valid_state
      return Success(data) unless should_be_unscheduled?(
        estimate: data[:estimate],
        type: data[:story_type]
      )

      data[:state] = 'unscheduled'
      Success(data)
    end

    def documents_attributes_changes
      story.documents_attributes_was = story.documents_attributes
      Success(story)
    end

    def update_story
      story.attributes = data
      if story.save
        Success(story)
      else
        Failure(story)
      end
    end

    def create_changesets
      story.changesets.create
      Success(story)
    end

    def apply_fixes
      story.fix_project_start_date
      story.fix_story_accepted_at
      story.project.save if story.project.start_date_previously_changed?
      Success(story)
    end

    def notify_state_changed
      Success StoryOperations::StateChangeNotification.notify_state_changed(story)
    end

    def notify_users
      Success StoryOperations::UserNotification.notify_users(story)
    end

    def notify_changes
      Success StoryOperations::PusherNotification.notify_changes(story)
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        story,
        current_user: current_user,
        action: 'update'
      )
    end
  end
end
