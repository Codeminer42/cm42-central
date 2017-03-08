class Activity < ActiveRecord::Base
  include Central::Support::ActivityConcern::Associations
  include Central::Support::ActivityConcern::Validations
  include Central::Support::ActivityConcern::Callbacks
  include Central::Support::ActivityConcern::Scopes

  scope :by_story, ->(story_id) { where(subject_id: story_id, subject_type: 'Story') }

  def decorate
    ActivityPresenter.new(self)
  end
end
