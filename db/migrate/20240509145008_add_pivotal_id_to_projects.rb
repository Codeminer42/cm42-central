class AddPivotalIdToProjects < ActiveRecord::Migration[7.1]
  def change
    add_column :projects, :pivotal_id, :bigint
    add_index :projects, :pivotal_id
  end
end
