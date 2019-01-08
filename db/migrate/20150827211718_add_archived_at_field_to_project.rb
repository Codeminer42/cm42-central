class AddArchivedAtFieldToProject < ActiveRecord::Migration[4.2]
  def change
    add_column :projects, :archived_at, :datetime, default: nil
  end
end
