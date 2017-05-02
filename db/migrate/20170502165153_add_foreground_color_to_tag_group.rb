class AddForegroundColorToTagGroup < ActiveRecord::Migration
  def change
    add_column :tag_groups, :foreground_color, :string
  end
end
