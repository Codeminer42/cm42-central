module Gitlab
  class Branch
    include Virtus.model

    attribute :name, String
    attribute :merged, Boolean
  end
end
