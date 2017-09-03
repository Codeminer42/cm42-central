class SlackMessage
  COLOR = '#36a64f'.freeze

  def initialize(model)
    @model = model
  end

  def message
    [story_changes]
  end

  private

  def story_changes
    {
      fallback: fallback,
      color: COLOR,
      title: project_name,
      title_link: story_url,
      text: description,
      fields: fields
    }
  end

  def fallback
    "The story '#{model.title}' has been #{model.state}."
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
      title: 'Assigned to',
      value: model.owned_by_name.to_s,
      short: true
    }
  end

  def points
    {
      title: 'Points',
      value: model.estimate.to_s,
      short: true
    }
  end

  attr_reader :model
end
