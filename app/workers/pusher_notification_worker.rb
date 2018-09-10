class PusherNotificationWorker
  include Sidekiq::Worker

  def perform(channel_name)
    Pusher.trigger(channel_name, 'notify_changes',
      message: I18n.t('update_stories_successfully'))
  end
end
