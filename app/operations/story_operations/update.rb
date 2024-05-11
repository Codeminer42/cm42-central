module StoryOperations
  class Update
    include Operation

    def initialize(story:, story_attrs:, current_user:)
      @story = story
      @story_attrs = story_attrs
      @comment_attrs = (story_attrs.delete(:comments_attributes) || {}).fetch("0", {})
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield ensure_valid_state
        yield update_story
        yield save_comment

        yield apply_fixes

        yield notify_state_changed
        yield notify_users
        yield notify_new_owner

        yield create_activity

        Success(story)
      end
    end

    private

    attr_reader :story, :story_attrs, :comment_attrs, :current_user

    def ensure_valid_state
      story_attrs[:state] = 'unscheduled' if should_be_unscheduled?(
        estimate: story_attrs[:estimate],
        type: story_attrs[:story_type]
      )

      Success(story_attrs)
    end

    def should_be_unscheduled?(estimate:, type:)
      story.project.point_values.any? &&
        Story.can_be_estimated?(type) && estimate.blank?
    end

    def update_story
      story.attributes = story_attrs
      story.acting_user = current_user
      if story.save
        Success(story)
      else
        Failure(story)
      end
    end

    def save_comment
      if comment_attrs.present?
        CommentOperations::Create.call(
          story: story,
          comment_attrs: comment_attrs,
          current_user: current_user,
        )
      end
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

    def notify_new_owner
      if new_owner_id = story.previous_changes["owned_by_id"]&.last
        if current_user.id != new_owner_id
          Notifications.new_story_owner(story, current_user).deliver_later
        end
      end
      Success story
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
