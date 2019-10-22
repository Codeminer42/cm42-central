require 'story_operations/member_notification'
require 'story_operations/state_change_notification'
require 'story_operations/legacy_fixes'
require 'story_operations/pusher_notification'
require 'story_operations/state_ensurement'

module StoryOperations
  class Create < BaseOperations::Create
    include MemberNotification
    include PusherNotification
    include StateEnsurement

    def before_save
      ensure_valid_state
    end

    def after_save
      model.changesets.create!

      notify_users
      notify_changes
    end

    private

    def ensure_valid_state
      model.state = 'unstarted' if should_be_unstarted? estimate: model.estimate, state: model.state
    end
  end

  class Update < BaseOperations::Update
    include MemberNotification
    include StateChangeNotification
    include LegacyFixes
    include PusherNotification
    include StateEnsurement

    def before_save
      ensure_valid_state

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

    def ensure_valid_state
      if should_be_unstarted? estimate: params['estimate'], state: params['state']
        params['state'] = 'unstarted'
      elsif should_be_unscheduled? estimate: params['estimate'], type: params['story_type']
        params['state'] = 'unscheduled'
      end
    end

    def documents_changed?
      model.documents_attributes != model.documents_attributes_was
    end

    def create_changesets
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
          .with_dependencies
          .where("state != 'accepted' OR accepted_at >= ?", current_iteration_start)
          .order('updated_at DESC')
      end
    end

    def iterations
      @iterations ||= Iterations::ProjectIterations.new(project: project)
    end
  end
end
