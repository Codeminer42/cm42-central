# This migration comes from attachinary (originally 20120612112526)
class CreateAttachinaryTables < ActiveRecord::Migration[4.2]
  def change
    create_table :attachinary_files do |t|
      t.integer  :attachinariable_id
      t.string  :attachinariable_type, limit: 255
      t.string :scope, limit: 255
      t.string :public_id, limit: 255
      t.string :version, limit: 255
      t.integer :width
      t.integer :height
      t.string :format, limit: 255
      t.string :resource_type, limit: 255
      t.timestamps
    end
    add_index :attachinary_files, [:attachinariable_type, :attachinariable_id, :scope], name: 'by_scoped_parent'
  end
end
