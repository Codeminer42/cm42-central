class AddPivotalIdToStories < ActiveRecord::Migration[7.1]
  def change
    add_column :stories, :pivotal_id, :bigint
    add_index :stories, :pivotal_id
  end
end
