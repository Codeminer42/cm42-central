class ProjectSerializer
  attr_accessor :name,
                :slug,
                :archived_at,
                :velocity,
                :volatility,
                :users_avatar,
                :avatar,
                :path_to,
                :tag_name,
                :tag_bg_color,
                :tag_fore_color

  def initialize(attrs = {})
    self.name = attrs.truncate_name
    self.velocity = attrs.velocity
    self.volatility = attrs.volatility
    self.slug = attrs.slug
    self.path_to = attrs.path_to
    self.archived_at = attrs.archived_date
    self.users_avatar = attrs.users_avatar(Project::MAX_MEMBERS_PER_CARD)
    self.tag_name = attrs.tag_group&.name
    self.tag_bg_color = attrs.tag_group&.bg_color
    self.tag_fore_color = attrs.tag_fore_color
  end

  def to_json
    {
      name: name,
      velocity: velocity,
      volatility: volatility,
      slug: slug,
      path_to: path_to,
      archived_at: archived_at,
      users_avatar: users_avatar,
      tag_name: tag_name,
      tag_bg_color: tag_bg_color,
      tag_fore_color: tag_fore_color
    }
  end

  def self.from_collection(collection)
    collection.map { |item| new(item).to_json }
  end
end
