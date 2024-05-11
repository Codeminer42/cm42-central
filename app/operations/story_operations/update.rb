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
        yield assign_attrs
        yield reposition
        yield save_story
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

    def assign_attrs
      story.attributes = story_attrs
      story.acting_user = current_user
      Success(story)
    end

    def reposition
      state_changes = story.changes["state"]
      return Success(story) unless state_changes
      before, after = *state_changes

      if (%w[unscheduled unstarted].include?(before) && after == "started") || (before == "rejected" && after == "started")
        position = :first
        if last_started_story = story.project.current_in_progress.stories.where.not(id: story.id).last
          position = { after: last_started_story }
        elsif first_unstarted_story = story.project.current_unstarted.stories.where.not(id: story.id).first
          position = { before: first_unstarted_story }
        end
        story.position = position
      end

      if %w[unscheduled unstarted started finished].include?(before) && after == "delivered"
        position = :first
        if last_delivered_story = story.project.current_delivered.stories.where.not(id: story.id).last
          position = { after: last_delivered_story }
        elsif first_in_progress_story = story.project.current_in_progress.stories.where.not(id: story.id).first
          position = { before: first_in_progress_story }
        end
        story.position = position
      end

      if after == "unscheduled"
        story.positioning_column = "#chilly_bin"
        story.position = :first
      end
      Success(story)
    end

    def save_story
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
