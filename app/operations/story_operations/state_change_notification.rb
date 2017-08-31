module StoryOperations
  module StateChangeNotification
    def notify_state_changed
      return unless can_notify_state_changed?

      Notifications.story_changed(model, model.acting_user).deliver_later
      IntegrationWorker.perform_async(model.project.id, integration_message)
    end

    def can_notify_state_changed?
      return false unless model.state_changed?
      return false if model.suppress_notifications
      return false unless model.acting_user

      actor = nil
      case model.state
      when 'started', 'delivered'
        actor = model.requested_by
        return false unless actor && actor.email_delivery?
      when 'accepted'
        actor = model.owned_by
        return false unless actor && actor.email_acceptance?
      when 'rejected'
        actor = model.owned_by
        return false unless actor && actor.email_rejection?
      else
        return false
      end

      model.acting_user != actor
    end

    def integration_message
      {
        discord: DiscordMessage.new(model).message,
        slack: SlackMessage.new(model).message,
        mattermost: mattermost
      }
    end

    def mattermost
      story = "['#{model.title}'](#{"#{model.base_uri}#story-#{model.id}"})"
      "[#{model.project.name}] The story #{story} has been #{model.state}."
    end
  end
end
