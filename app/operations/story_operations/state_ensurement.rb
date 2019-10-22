module StoryOperations
  module StateEnsurement
    def should_be_unscheduled?(estimate:, type:)
      Story.can_be_estimated?(type) && estimate.blank?
    end
  end
end
