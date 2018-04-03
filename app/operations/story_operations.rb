require 'story_operations/member_notification'
require 'story_operations/state_change_notification'
require 'story_operations/legacy_fixes'
require 'story_operations/project_iteration'

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
    include ProjectIteration

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
        past_iterations: past_iterations
      }
    end

    private

    def past_iterations
      (0..number_of_iterations - 1).to_a.map do |iteration_number|
        start_date = start_date(iteration_number)
        end_date = end_date(start_date)
        Iteration.new(start_date, end_date, @project)
      end
    end

    def start_date(iteration_number)
      project_start_date + (iteration_number * iteration_length_in_days)
    end

    def end_date(start_date)
      start_date + iteration_length_in_days - 1
    end

    def active_stories
      order(@story_scope.where("state != 'accepted' OR
        accepted_at > ?", current_iteration_start_date))
    end

    def order(query)
      query.order('updated_at DESC').tap do |relation|
        relation.limit(ENV['STORIES_CEILING']) if ENV['STORIES_CEILING']
      end
    end
  end
end
