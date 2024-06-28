class RemoveStoriesFromUserService
  def self.call(*args)
    new(*args).call
  end

  def initialize(user, project)
    @user = user
    @project = project
  end

  def call
    project.stories
           .where(requested_by_id: user.id)
           .or(project.stories.where(owned_by_id: user.id))
           .where.not(state: "accepted").each do |story|

      requested_by_attrs = user.requested?(story) ? { requested_by_id: nil, requested_by_name: nil } : {}
      owned_by_attrs = user.owns?(story) ? { owned_by_id: nil, owned_by_name: nil } : {}

      story_attrs = requested_by_attrs.merge(owned_by_attrs)

      story.update!(story_attrs)
    end
  end

  private

  attr_reader :user, :project
end
