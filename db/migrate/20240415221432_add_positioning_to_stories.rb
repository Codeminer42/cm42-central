class AddPositioningToStories < ActiveRecord::Migration[6.1]
  def change
    change_column :stories, :position, :integer
    add_column :stories, :positioning_column, :string
    add_index :stories, [:project_id, :positioning_column, :position], unique: true
  end
end
