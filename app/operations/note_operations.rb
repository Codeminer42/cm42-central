module NoteOperations
  module MemberNotification
    def self.included(base)
      base.class_eval do
        delegate :user, :story, to: :model
      end
    end

    def notify_users
      return if user.nil?
      return if story.suppress_notifications
      return if users_to_notify.none?

      notifier = Notifications.new_note(model.id, users_to_notify.map(&:email))
      notifier&.deliver
    end

    def users_to_notify
      @users_to_notify ||= (story.stakeholders_users + note_users).uniq.reject { |u| u == user }
    end

    def note_users
      usernames = UsernameParser.parse(model.note)
      return [] if usernames.empty?

      story.users.where(username: usernames)
    end
  end

  class Create < BaseOperations::Create
    include MemberNotification

    def after_save
      model.story.changesets.create!
      notify_users
    end
  end
end
