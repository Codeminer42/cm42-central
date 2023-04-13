require 'story_operations/legacy_member_notification'
require 'story_operations/state_change_notification'
require 'story_operations/legacy_fixes'
require 'story_operations/legacy_pusher_notification'
require 'story_operations/state_ensurement'

module StoryOperations
  class Create
    include Dry::Monads[:result, :do]

    def call(params)
      ActiveRecord::Base.transaction do
        story = yield save_story(params[:story])
        yield create_changesets(story)

        yield create_activity(story, params[:current_user])

        yield notify_users(story)
        yield notify_changes(story)

        Success(story)
      end
    rescue
      Failure(params[:story])
    end

    private

    def save_story(story)
      if story.save
        Success(story)
      else
        Failure(story)
      end
    end

    def create_changesets(story)
      story.changesets.create
      Success(story)
    end

    def notify_users(story)
      Success StoryOperations::UserNotification.notify_users(story)
    end

    def notify_changes(story)
      Success StoryOperations::PusherNotification.notify_changes(story)
    end

    def create_activity(story, current_user)
      Success ::Base::ActivityRecording.create_activity(story, current_user)
    end
  end

  class Update < BaseOperations::Update
    include LegacyMemberNotification
    include StateChangeNotification
    include LegacyFixes
    include LegacyPusherNotification
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
      return unless should_be_unscheduled? estimate: params['estimate'], type: params['story_type']

      params['state'] = 'unscheduled'
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
    include LegacyPusherNotification

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
