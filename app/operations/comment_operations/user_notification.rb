module CommentOperations
  class UserNotification
    def self.notify_users(comment:, current_user:)
      new(comment: comment, current_user: current_user).notify_users
    end

    def initialize(comment:, current_user:)
      @comment = comment
      @current_user = current_user
    end

    def notify_users
      return if comment.user.nil?
      return if comment.story.suppress_notifications
      return if users_to_notify.none?

      users_to_notify.map(&:email).each do |email|
        Notifications.new_comment(email, comment).deliver_later
      end
    end

    private

    attr_reader :comment, :current_user

    def users_to_notify
      (comment.story.stakeholders_users - [current_user] + comment_users).uniq
    end

    def comment_users
      usernames = UsernameParser.parse(comment.body)
      return [] if usernames.empty?

      comment.story.users.where(username: usernames)
    end
  end
end
