module StoryOperations
  class Create
    include Operation

    def initialize(project:, story:, story_attrs:, current_user:)
      @project = project
      @story = story
      @story_attrs = story_attrs
      @comment_attrs = (story_attrs.delete(:comments_attributes) || {}).fetch("0", {})
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield set_attrs
        yield save_story
        yield position_story
        yield save_comment

        yield create_activity
        yield refresh_other_users

        yield notify_users

        Success(story)
      end
    end

    private

    attr_reader :project, :story, :story_attrs, :comment_attrs, :current_user

    def set_attrs
      story.attributes = story_attrs
      story.project = project
      story.requested_by ||= current_user
      Success(story)
    end

    def save_story
      if story.save
        Success(story)
      else
        Failure(story)
      end
    end

    def position_story
      position = :first
      if story.positioning_column == "#todo"
        next_story = Story.where({
          positioning_column: story.positioning_column,
          state: "unstarted",
        }).order(:position).first
        if next_story
          position = next_story.position
        else
          position = :last
        end
      end

      story.update! position: position
      Success(story)
    end

    def save_comment
      if comment_attrs.present?
        CommentOperations::Save.call(
          story: story,
          comment_attrs: comment_attrs,
          current_user: current_user
        )
      end
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
