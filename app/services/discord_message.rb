class DiscordMessage
  COLOR = 0x36a64f

  def initialize(model)
    @model = model
  end

  def message
    [story_changes]
  end

  private

  def story_changes
    {
      color: COLOR,
      title: project_name,
      url: story_url,
      description: description,
      fields: fields
    }
  end

  def project_name
    model.project.name.to_s
  end

  def story_url
    "#{model.base_uri}#story-#{model.id}"
  end

  def description
    "The story '#{model.title}' has been #{model.state}."
  end

  def fields
    [assigned, points]
  end

  def assigned
    {
      name: 'Assigned to',
      value: model.owned_by_name.to_s,
      inline: true
    }
  end

  def points
    {
      name: 'Points',
      value: model.estimate.to_s,
      inline: true
    }
  end

  attr_reader :model
end
