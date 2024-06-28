module NoteOperations
  class UserNotification
    def self.notify_users(note:, current_user:)
      new(note: note, current_user: current_user).notify_users
    end

    def initialize(note:, current_user:)
      @note = note
      @current_user = current_user
    end

    def notify_users
      return if note.user.nil?
      return if note.story.suppress_notifications
      return if users_to_notify.none?

      notifier = Notifications.new_note(note.id, users_to_notify.map(&:email))
      notifier&.deliver
    end

    private

    attr_reader :note, :current_user

    def users_to_notify
      (note.story.stakeholders_users + note_users).uniq.reject { |user| user == current_user }
    end

    def note_users
      usernames = UsernameParser.parse(note.note)
      return [] if usernames.empty?

      note.story.users.where(username: usernames)
    end
  end
end
