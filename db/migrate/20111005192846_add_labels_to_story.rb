class AddLabelsToStory < ActiveRecord::Migration[4.2]
  def self.up
    add_column :stories, :labels, :string, limit: 255
  end

  def self.down
    remove_column :stories, :labels
  end
end
