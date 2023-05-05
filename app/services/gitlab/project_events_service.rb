module Gitlab
  class ProjectEventsService
    def initialize(params)
      @params = params
    end

    def self.perform(params)
      new(params).perform
    end

    def perform
      deliver_story if merged?
    end

    private

    def merged?
      @params['object_attributes']['action'] == 'merge' && @params['object_kind'] == 'merge_request'
    end

    def deliver_story
      StoryOperations::Update.call(
        story: story,
        data: { state: 'delivered' },
        current_user: user
      )
    end

    def user
      @user ||= story.owned_by || story.requested_by
    end

    def story
      @story ||= Story.find_by branch: @params['object_attributes']['source_branch']
    end
  end
end
