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
end
