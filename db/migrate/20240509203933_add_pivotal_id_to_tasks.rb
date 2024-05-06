class AddPivotalIdToTasks < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :pivotal_id, :bigint
    add_index :tasks, :pivotal_id
  end
end
