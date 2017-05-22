class ProjectWithRelatedStoriesQuery
  def self.call(*args)
    new(*args).call
  end

  def initialize(project, relation = nil)
    @project = project
    @relation = (relation || project.stories).select(columns_for_project)
  end

  def call
    @relation = relation.union(related_stories) if project.tag_group.present?

    relation.with_dependencies.order('updated_at DESC')
  end

  private

  attr_reader :project, :relation

  def related_stories
    related_projects = Project.related_projects(project)

    Story
      .select(columns_for_related)
      .where(project: related_projects, story_type: 'release')
      .where.not(state: 'unscheduled')
  end

  def columns_for_related
   columns << "'related' AS story_type"
  end

  def columns_for_project
    columns << 'story_type AS story_type'
  end

  def columns
   exclude_columns = %w(story_type)

   Story.attribute_names - exclude_columns
  end
end
