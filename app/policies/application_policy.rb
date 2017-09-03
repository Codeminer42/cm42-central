require 'active_support/core_ext/module/delegation'

class ApplicationPolicy
  module CheckRoles
    def self.included(base)
      base.class_eval do
        delegate :current_user, :current_team, :current_project, :current_story,
                 to: :context
      end
    end

    protected

    def root?
      # this user can do anothing, it goes in AdminUser instead of User and bypasses everything
      context.active_admin
    end

    def admin?
      root? || (current_team && current_team.is_admin?(current_user))
    end

    def guest?
      current_user.guest?
    end

    def project_member?
      root? || (current_project && current_project.users.find_by(id: current_user.id))
    end

    def story_member?
      root? || (current_story && current_story.project.users.find_by(id: current_user.id))
    end

    def team_member?
      root? || (current_team && current_team.users.find_by(id: current_user.id))
    end
  end
  include CheckRoles

  attr_reader :context, :record

  def initialize(context, record)
    if context.is_a?(AdminUser)
      context = PunditContext.new(nil, context, active_admin: true)
    end
    raise Pundit::NotAuthorizedError, 'Must be signed in.' unless context.current_user
    @context = context
    @record  = record
  end

  def manage?
    create? && update? && destroy?
  end

  def index?
    admin?
  end

  def show?
    index?
  end

  def create?
    admin?
  end

  def new?
    create?
  end

  def update?
    create?
  end

  def edit?
    update?
  end

  def destroy?
    create?
  end

  def scope
    Pundit.policy_scope!(context, record.class)
  end

  class Scope
    include CheckRoles
    attr_reader :context, :scope

    def initialize(context, scope)
      if context.is_a?(AdminUser)
        context = PunditContext.new(nil, context, active_admin: true)
      end
      @context = context
      @scope   = scope
    end

    def resolve
      scope
    end
  end
end
