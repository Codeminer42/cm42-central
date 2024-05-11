class AddHiddenToPivotalProjects < ActiveRecord::Migration[7.1]
  def change
    add_column :pivotal_projects, :hidden, :boolean, null: false, default: false
  end
end
