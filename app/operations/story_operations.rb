require 'story_operations/member_notification'
require 'story_operations/state_change_notification'
require 'story_operations/legacy_fixes'
require 'story_operations/pusher_notification'

module StoryOperations
  class Create < BaseOperations::Create
    include MemberNotification
    include PusherNotification

    def after_save
      model.changesets.create!

      notify_users
      notify_changes
    end
  end

  class Update < BaseOperations::Update
    include MemberNotification
    include StateChangeNotification
    include LegacyFixes
    include PusherNotification

    def before_save
      model.documents_attributes_was = model.documents_attributes
    end

    def after_save
      create_changesets
      apply_fixes
      notify_state_changed
      notify_users
      notify_changes
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

  class UpdateAll < BaseOperations::UpdateAll; end

  class Destroy < BaseOperations::Destroy
    include PusherNotification

    def after_save
      notify_changes
    end
  end

  class DestroyAll < BaseOperations::DestroyAll; end

  class ReadAll
    delegate :past_iterations, :current_iteration_start, to: :iterations

    def self.call(*args)
      new(*args).run
    end

    def initialize(project:)
      @project = project
    end

    def run
      {
        active_stories: active_stories,
        past_iterations: past_iterations
      }
    end

    private

    attr_reader :project

    def active_stories
      @active_stories ||= begin
        project
          .stories
          .where("state != 'accepted' OR accepted_at >= ?", current_iteration_start)
          .order('updated_at DESC')
      end
    end

    def iterations
      @iterations ||= Iterations::ProjectIterations.new(project: project)
    end
  end
end
