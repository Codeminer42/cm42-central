module Service
  extend ActiveSupport::Concern

  included do
    def call(_)
      raise NotImplementedError
    end
  end

  module ClassMethods
    def call(*args)
      new.call(*args)
    end
  end
end
