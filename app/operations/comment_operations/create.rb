module CommentOperations
  class Create
    include Operation

    def initialize(story:, comment_attrs:, current_user:, comment: nil)
      @story = story
      @comment_attrs = comment_attrs
      @comment = comment || story.comments.build
      @current_user = current_user
    end

    def call
      ActiveRecord::Base.transaction do
        yield set_attrs
        yield save_comment
        if comment.saved_change_to_story_id? || comment.smtp_id.blank?
          yield notify_users
          yield create_activity
        end
        Success(comment)
      end
    end

    private

    attr_reader :story, :comment_attrs, :comment, :current_user

    def set_attrs
      comment.attributes = comment_attrs.merge({
        story: story,
        user: current_user,
      })
      Success comment
    end

    def save_comment
      # wrap in transaction to ensure it actually exists in the db before shipping it off to sidekiq in #deliver_later
      story.transaction do
        if comment.save
          Success(comment)
        else
          Failure(comment)
        end
      end
    end

    def notify_users
      Success UserNotification.notify_users(
        comment: comment,
        current_user: current_user,
      )
    end

    def create_activity
      Success ::Base::ActivityRecording.create_activity(
        comment,
        current_user: current_user,
        action: 'create'
      )
    end
  end
end
