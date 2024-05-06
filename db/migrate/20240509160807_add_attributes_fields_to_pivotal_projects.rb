class AddAttributesFieldsToPivotalProjects < ActiveRecord::Migration[7.1]
  def change
    add_column :pivotal_projects, :project_attributes, :mediumtext
    add_column :pivotal_projects, :memberships_attributes, :mediumtext
    add_column :pivotal_projects, :labels_attributes, :mediumtext
    add_column :pivotal_projects, :stories_attributes, :longtext
    add_column :pivotal_projects, :activities_attributes, :mediumtext
  end
end
