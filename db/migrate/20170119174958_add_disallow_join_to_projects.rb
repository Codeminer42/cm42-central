class AddDisallowJoinToProjects < ActiveRecord::Migration[4.2]
  def change
    add_column :projects, :disallow_join, :boolean, null: false, default: true
  end
end
