class AddDeliveredAtToStories < ActiveRecord::Migration
  def change
    add_column :stories, :delivered_at, :datetime
  end
end
