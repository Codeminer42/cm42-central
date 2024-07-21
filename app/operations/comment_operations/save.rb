module CommentOperations
  class Save
    include Operation

    def initialize(story:, comment_attrs:, current_user:, comment: nil)
      @story = story
      @comment_attrs = comment_attrs
      @comment = comment || story.comments.build
      @new_comment = comment.nil? || (comment.smtp_id.present? && comment.body.nil?)
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
        user: user,
      })
      Success comment
    end

    def user
      @new_comment ? current_user : comment.user
    end

    def save_comment
      if comment.save
        Success(comment)
      else
        Failure(comment)
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
        action: @new_comment ? 'create' : 'update'
      )
    end
  end
end
