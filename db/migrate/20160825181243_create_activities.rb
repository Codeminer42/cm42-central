class CreateActivities < ActiveRecord::Migration[4.2]
  def change
    create_table :activities do |t|
      t.references :project, null: false
      t.references :user, null: false
      t.integer :subject_id
      t.string :subject_type, limit: 255
      t.string :action, limit: 255
      t.text :subject_changes, default: nil
      t.string :subject_destroyed_type, limit: 255

      t.timestamps
    end
    add_index :activities, [:project_id]
    add_index :activities, [:user_id]
    add_index :activities, [:project_id, :user_id]
  end
end
