class ProjectBoard
  include ActiveModel::Model

  attr_accessor :project
  attr_accessor :users
  attr_accessor :stories
  attr_accessor :past_iterations
  attr_accessor :current_user
  attr_accessor :current_flow
  attr_accessor :default_flow
  attr_accessor :project_labels
end
