class AddDeliveredAtToStories < ActiveRecord::Migration[4.2]
  def change
    add_column :stories, :delivered_at, :datetime
  end
end
