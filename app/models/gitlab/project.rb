module Gitlab
  class Project
    include Virtus.model

    attribute :id, Integer
    attribute :name, String
  end
end
