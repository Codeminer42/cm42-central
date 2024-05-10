require 'active_support/core_ext/module/delegation'

class ApplicationPolicy
  module CheckRoles
    def self.included(base)
      base.class_eval do
        delegate :current_user, :current_project, :current_story,
                 to: :context
      end
    end

    protected

    delegate :guest?, to: :current_user

    def admin?
      current_user.admin?
    end

    def project_member?
      current_project && current_project.users.find_by(id: current_user.id)
    end

    def story_member?
      current_story && current_story.project.users.find_by(id: current_user.id)
    end
  end
  include CheckRoles

  attr_reader :context, :record

  def initialize(context, record)
    if context.is_a?(User) && context.admin?
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
