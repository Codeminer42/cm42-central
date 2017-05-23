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
      story_link = "#{model.base_uri}#story-#{model.id}"

      {slack: [
          {
              fallback: "The story '#{model.title}' has been #{model.state}.",
              color: '#36a64f',
              title: "#{model.project.name}",
              title_link: "#{story_link}",
              text: "The story '#{model.title}' has been #{model.state}.",
              fields: [
                  {
                      title: 'Assigned to',
                      value: "#{model.owned_by_name}",
                      short: true
                  },
  				        {
 					          title: 'Points',
                     value: "#{model.estimate}",
                     short: true
 				        }
             ]
         }
       ],
       mattermost: "[#{model.project.name}] The story ['#{model.title}'](#{story_link}) has been #{model.state}."
     }
    end
  end
end
