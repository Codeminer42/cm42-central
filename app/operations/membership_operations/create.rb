module MembershipOperations
  class Create
    include Operation

    def initialize(project:, user:)
      @project = project
      @user = user
    end

    attr_reader :project, :user

    def call
      if already_member?
        Failure(project)
      else
        create_membership
        bust_caches
        Success(project)
      end
    end

    private

    def create_membership
      project.users << user
    end

    def bust_caches
      # so that new user appears in story forms
      project.stories.not_accepted.touch_all
    end

    def already_member?
      project.users.include?(user)
    end
  end
end

