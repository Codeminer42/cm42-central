class CreateTasks < ActiveRecord::Migration[4.2]
  def self.up
    create_table :tasks do |t|
      t.references :story
      t.string :name, limit: 255
      t.boolean :done, default: false

      t.timestamps
    end
    add_index :tasks, :story_id
  end

  def self.down
    drop_table :tasks
  end
end
