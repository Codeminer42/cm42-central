class RemoveStoriesFromUserService
  def self.call(*args)
    new(*args).call
  end

  def initialize(user, project)
    @user = user
    @project = project
  end

  def call
    project.stories.each do |story|
      story.update!(requested_by_id: nil, requested_by_name: nil) if story.requested_by_id == user.id
      story.update!(owned_by_id: nil, owned_by_name: nil) if story.owned_by_id == user.id
    end
  end

  private

  attr_reader :user, :project
end
