class AddPivotalIdToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :pivotal_id, :bigint
    add_index :users, :pivotal_id
  end
end
