class ProjectSerializer
  attr_accessor :name,
    :slug,
    :archived_at,
    :velocity,
    :volatility,
    :users_avatar,
    :avatar,
    :path_to

  def initialize(attrs = {})
    self.name = attrs.truncate_name
    self.velocity = attrs.velocity,
    self.volatility = attrs.volatility
    self.slug = attrs.slug
    self.path_to = attrs.path_to
    self.archived_at = attrs.archived_date
    self.users_avatar = attrs.users_avatar(Project::MAX_MEMBERS_PER_CARD)
  end

  def to_json
    {
      name: name,
      velocity: velocity.first,
      volatility: volatility,
      slug: slug,
      path_to: path_to,
      archived_at: archived_at,
      users_avatar: users_avatar
    }
  end

  def self.from_collection(collection)
    collection.map { |item| self.new(item).to_json }
  end
end

