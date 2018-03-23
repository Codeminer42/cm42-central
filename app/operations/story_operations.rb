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
    MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24

    def self.call(*args)
      new(*args).run
    end

    def initialize(story_scope:, project:)
      @story_scope = story_scope
      @project = project
    end

    def run
      except_done_stories(@story_scope.with_dependencies).order('updated_at DESC').tap do |relation|
        relation.limit(ENV['STORIES_CEILING']) if ENV['STORIES_CEILING']
      end
    end

    private

    def current_iteration
      current_date = Date.current
      start_date = @project.start_date
      difference = (current_date - start_date).to_f
      days_apart = (difference / MILLISECONDS_IN_A_DAY).round
      days_in_iteration = @project.iteration_length * 7
      iteration_number = ((days_apart / days_in_iteration) + 1).floor
    end

    def except_done_stories(relation)
      relation
        .where.not(state: 'accepted')
        .where(
          'accepted_at < ?', @project.created_at + (((current_iteration - 1) * @project.iteration_length * 7) + 1).days
        )
    end
  end
end
