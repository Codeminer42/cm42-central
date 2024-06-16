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
      board = story.project.board

      if (%w[unscheduled unstarted].include?(before) && after == "started") || (before == "rejected" && after == "started")
        position = :first
        if last_started_story = board.current_todo.stories.where.not(id: story.id).last
          position = { after: last_started_story }
        end
        story.position = position
      end

      if %w[unscheduled unstarted started finished].include?(before) && after == "delivered"
        position = :first
        if last_delivered_story = board.current_delivered.stories.where.not(id: story.id).last
          position = { after: last_delivered_story }
        end
        story.position = position
      end

      if after == "unscheduled"
        story.positioning_column = "#icebox"
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
      fix_project_start_date
      fix_project_accepted_at
      Success(story)
    end

    # Set the project start date to today if the project start date is nil
    # and the state is changing to any state other than 'unstarted' or 'unscheduled'
    def fix_project_start_date
      if [
        story.state_previously_changed?,
        story.project && !story.project.start_date,
        !%w[unstarted unscheduled].include?(story.state),
      ].all?
        story.project.update! start_date: Date.current
      end
    end

    # If a story's 'accepted at' date is prior to the project start date,
    # the project start date should be moved back accordingly
    def fix_project_accepted_at
      if [
        story.accepted_at_previously_changed?,
        story.accepted_at && story.accepted_at < story.project.start_date,
      ].all?
        story.project.update! start_date: story.accepted_at
      end
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
