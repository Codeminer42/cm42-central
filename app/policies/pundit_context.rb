class PunditContext
  attr_reader :current_user, :current_story, :current_project, :active_admin

  def initialize(current_project, current_user, options = {})
    @current_project = current_project
    @current_user    = current_user
    @current_story   = options.delete(:current_story)
    @active_admin    = options.delete(:active_admin) || false
  end
end
