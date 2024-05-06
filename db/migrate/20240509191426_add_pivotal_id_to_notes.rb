class AddPivotalIdToNotes < ActiveRecord::Migration[7.1]
  def change
    add_column :notes, :pivotal_id, :bigint
    add_index :notes, :pivotal_id
  end
end
