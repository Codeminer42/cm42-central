module StoryOperations
  class Create
    include Dry::Monads[:result, :do]

    def call(story:, current_user:)
      ActiveRecord::Base.transaction do
        story = yield save_story(story)
        yield create_changesets(story)
        yield create_activity(story, current_user: current_user)

        yield notify_users(story)
        yield notify_changes(story)

        Success(story)
      end
    rescue
      Failure(story)
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

    def call(story:, data:, current_user:)
      ActiveRecord::Base.transaction do
        data = yield ensure_valid_state(data.to_hash)
        story = yield documents_attributes_changes(story)
        story = yield update_story(story: story, data: data)

        yield create_changesets(story)
        yield apply_fixes(story)

        yield notify_state_changed(story)
        yield notify_users(story)
        yield notify_changes(story)

        yield create_activity(story, current_user: current_user)

        Success(story)
      end
    rescue
      Failure(story)
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

  class UpdateAll
    include Dry::Monads[:result, :do]

    def call(stories:, data:, current_user:)
      stories = yield update_stories(
        stories: stories,
        data: data,
        current_user: current_user
      )

      Success(stories)
    rescue
      Failure(false)
    end

    private

    # TODO: we should probably use a transaction here
    def update_stories(stories:, data:, current_user:)
      updated_stories = stories.map do |story|
        Update.new.call(story: story, data: data, current_user: current_user)
      end

      return Failure(updated_stories) unless updated_stories.all?(&:success?)

      Success(updated_stories)
    end
  end

  class Destroy
    include Dry::Monads[:result, :do]

    def call(story:, current_user:)
      story = yield delete_story(story)
      yield notify_changes(story)
      yield create_activity(story, current_user: current_user)

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

  class DestroyAll
    include Dry::Monads[:result, :do]

    def call(stories:, current_user:)
      deleted_stories = yield destroy_stories(
        stories: stories
      )

      yield create_activity(deleted_stories, current_user: current_user)

      Success(deleted_stories)
    rescue
      Failure(false)
    end

    private

    def destroy_stories(stories:)
      deleted_stories = stories.destroy_all
      Success(deleted_stories)
    end

    def create_activity(stories, current_user:)
      Success ::Base::ActivityRecording.create_activity(
        stories,
        current_user: current_user,
        action: 'destroy'
      )
    end
  end

  class ReadAll
    include Dry::Monads[:result, :do]

    delegate :past_iterations, :current_iteration_start, to: :iterations

    def call(project:)
      @project = project

      yield active_stories
      yield project_iterations

      Success(
        active_stories: @active_stories,
        past_iterations: past_iterations
      )
    end

    private

    attr_reader :project

    def iterations
      @project_iterations ||= Iterations::ProjectIterations.new(project: project)
    end

    def project_iterations
      @project_iterations ||= iterations
      Success(@project_iterations)
    end

    def active_stories
      @active_stories ||= begin
        project
          .stories
          .with_dependencies
          .where("state != 'accepted' OR accepted_at >= ?", current_iteration_start)
          .order('updated_at DESC')
      end

      Success(@active_stories)
    end
  end
end
