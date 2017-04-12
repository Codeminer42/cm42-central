class AddTagGroupIdToProject < ActiveRecord::Migration
  def change
    add_column :projects, :tag_group_id, :integer
  end
end
