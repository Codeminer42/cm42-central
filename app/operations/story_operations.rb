require 'story_operations/member_notification'
require 'story_operations/state_change_notification'
require 'story_operations/legacy_fixes'

module StoryOperations
  class Create < BaseOperations::Create
    include MemberNotification

    def after_save
      model.changesets.create!

      notify_users
    end
  end

  class Update < BaseOperations::Update
    include MemberNotification
    include StateChangeNotification
    include LegacyFixes

    def before_save
      model.documents_attributes_was = model.documents_attributes
    end

    def after_save
      create_changesets
      apply_fixes
      notify_state_changed
      notify_users
    end

    private

    def documents_changed?
      model.documents_attributes != model.documents_attributes_was
    end

    def create_changesets
      if documents_changed?
        model.instance_variable_set(
          '@changed_attributes',
          model.instance_variable_get('@changed_attributes').merge(
            documents_attributes: model.documents_attributes_was
            )
          )
      end

      model.changesets.create!
    end
  end

  class Destroy < BaseOperations::Destroy
  end

  class DestroyAll < BaseOperations::DestroyAll
  end

  class ReadAll
    def self.call(*args)
      new(*args).run
    end

    def initialize(story_scope:, project:)
      @story_scope = story_scope.with_dependencies
      @project = project
    end

    def run
      {
        active_stories: active_stories,
        done_stories: done_stories
      }
    end

    private

    def active_stories
      order(@story_scope.where("state != 'accepted' OR
        accepted_at > ?", current_sprint))
    end

    def done_stories
      @story_scope.where.not(id: active_stories).map do |story|
        {
          id: story.id,
          estimate: story.estimate,
          created_at: story.created_at.to_date
        }
      end
    end

    def order(query)
      query.order('updated_at DESC').tap do |relation|
        relation.limit(ENV['STORIES_CEILING']) if ENV['STORIES_CEILING']
      end
    end

    def current_sprint
      @project.created_at + (((current_iteration - 1) * @project.iteration_length * 7) + 1).days
    end

    def current_iteration
      ((days_since_project_start / days_in_iteration) + 1).floor
    end

    def days_since_project_start
      Date.current - @project.start_date
    end

    def days_in_iteration
      @project.iteration_length * 7
    end
  end
end
