class AddPositionToStories < ActiveRecord::Migration[4.2]
  def self.up
    add_column :stories, :position, :decimal
  end

  def self.down
    remove_column :stories, :position
  end
end
