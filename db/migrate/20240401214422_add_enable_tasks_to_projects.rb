class AddEnableTasksToProjects < ActiveRecord::Migration[6.1]
  def change
    add_column :projects, :enable_tasks, :boolean, null: false, default: false
  end
end
