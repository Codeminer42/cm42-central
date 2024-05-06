class AddPivotalIdToActivities < ActiveRecord::Migration[7.1]
  def change
    add_column :activities, :pivotal_id, :string
    add_index :activities, :pivotal_id
  end
end
