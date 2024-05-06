class AddPivotalIdToActiveStorageAttachments < ActiveRecord::Migration[7.1]
  def change
    add_column :active_storage_attachments, :pivotal_id, :bigint
    add_index :active_storage_attachments, :pivotal_id
  end
end
