class CreateActiveAdminComments < ActiveRecord::Migration[4.2]
  def self.up
    create_table :active_admin_comments do |t|
      t.string :namespace, limit: 255
      t.text   :body
      t.string :resource_id, limit: 255, null: false
      t.string :resource_type, limit: 255, null: false
      t.integer  :author_id
      t.string  :author_type, limit: 255
      t.timestamps
    end
    add_index :active_admin_comments, [:namespace]
    add_index :active_admin_comments, [:author_type, :author_id]
    add_index :active_admin_comments, [:resource_type, :resource_id]
  end

  def self.down
    drop_table :active_admin_comments
  end
end
