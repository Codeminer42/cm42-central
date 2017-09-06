module SidebarController
  extend ActiveSupport::Concern

  included do
    def define_sidebar(sidebar)
      @sidebar = sidebar
    end

    def sidebar
      @sidebar
    end
  end
end
