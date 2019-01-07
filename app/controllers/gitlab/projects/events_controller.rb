module Gitlab
  module Projects
    class EventsController < WebhookBaseController
      def create
        Gitlab::ProjectEventsService.perform(params)
        head :ok
      end
    end
  end
end
