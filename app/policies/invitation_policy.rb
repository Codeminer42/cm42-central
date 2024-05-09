class InvitationPolicy < ApplicationPolicy
  def new?
    admin?
  end

  def create?
    admin?
  end

  def show
    true
  end
end

