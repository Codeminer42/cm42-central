class AddBlockersToStories < ActiveRecord::Migration[7.1]
  def change
    add_column :stories, :blockers, :mediumtext
  end
end
