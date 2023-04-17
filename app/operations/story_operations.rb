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
        yield create_activity(story, current_user: params[:current_user])

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

    def create_activity(story, current_user:)
      Success ::Base::ActivityRecording.create_activity(
        story,
        current_user: current_user,
        action: 'create'
      )
    end
  end

  class Update
    include Dry::Monads[:result, :do]

    def call(params)
      ActiveRecord::Base.transaction do
        data = yield ensure_valid_state(params[:data].to_hash)
        story = yield documents_attributes_changes(params[:story])
        story = yield update_story(story: story, data: data)

        yield create_changesets(story)
        yield apply_fixes(story)

        yield notify_state_changed(story)
        yield notify_users(story)
        yield notify_changes(story)

        yield create_activity(story, current_user: params[:current_user])

        Success(story)
      end
    rescue
      Failure(params[:story])
    end

    private

    def should_be_unscheduled?(estimate:, type:)
      Story.can_be_estimated?(type) && estimate.blank?
    end

    def ensure_valid_state(data)
      return Success(data) unless should_be_unscheduled?(
        estimate: data['estimate'],
        type: data['story_type']
      )

      data['state'] = 'unscheduled'
      Success(data)
    end

    def documents_attributes_changes(story)
      story.documents_attributes_was = story.documents_attributes
      Success(story)
    end

    def update_story(story:, data:)
      story.attributes = data
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

    def apply_fixes(story)
      story.fix_project_start_date
      story.fix_story_accepted_at
      story.project.save if story.project.start_date_previously_changed?
      Success(story)
    end

    def notify_state_changed(story)
      Success StoryOperations::StateChangeNotification.notify_state_changed(story)
    end

    def notify_users(story)
      Success StoryOperations::UserNotification.notify_users(story)
    end

    def notify_changes(story)
      Success StoryOperations::PusherNotification.notify_changes(story)
    end

    def create_activity(story, current_user:)
      Success ::Base::ActivityRecording.create_activity(
        story,
        current_user: current_user,
        action: 'update'
      )
    end
  end

  class UpdateAll < BaseOperations::UpdateAll; end

  class Destroy
    include Dry::Monads[:result, :do]

    def call(params)
      story = yield delete_story(params[:story])
      yield notify_changes(story)
      yield create_activity(story, current_user: params[:current_user])

      Success(story)
    end

    def delete_story(story)
      Success(story.destroy)
    end

    def notify_changes(story)
      Success ::StoryOperations::PusherNotification.notify_changes(story)
    end

    def create_activity(story, current_user:)
      Success ::Base::ActivityRecording.create_activity(
        story,
        current_user: current_user,
        action: 'destroy'
      )
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
