class AddNewPositionToStory < ActiveRecord::Migration[5.2]
  def change
    add_column :stories, :new_position, :integer, null: true
  end
  def down
    remove_column :stories, :new_position
  end
end
