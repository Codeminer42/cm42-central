module SidebarController
  extend ActiveSupport::Concern

  included do
    def define_sidebar(sidebar)
      @sidebar = sidebar
    end

    def sidebar
      return @sidebar
    end
  end
end
