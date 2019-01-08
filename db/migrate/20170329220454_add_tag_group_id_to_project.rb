class AddTagGroupIdToProject < ActiveRecord::Migration[4.2]
  def change
    add_column :projects, :tag_group_id, :integer
  end
end
