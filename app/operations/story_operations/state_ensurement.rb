module StoryOperations
  module StateEnsurement
    def should_be_unstarted?(estimate:, state:)
      estimate.present? && state == 'unscheduled'
    end

    def should_be_unscheduled?(estimate:, type:)
      Story.can_be_estimated?(type) && estimate.blank?
    end
  end
end
