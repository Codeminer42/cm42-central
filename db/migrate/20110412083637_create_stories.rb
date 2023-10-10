class CreateStories < ActiveRecord::Migration[4.2]
  def self.up
    create_table :stories do |t|
      t.string :title, limit: 255
      t.text :description
      t.integer :estimate
      t.string :story_type, limit: 255, default: 'feature'
      t.string :state, limit: 255, default: 'unstarted'
      t.date :accepted_at
      t.integer :requested_by_id
      t.integer :owned_by_id
      t.references :project

      t.timestamps
    end
  end

  def self.down
    drop_table :stories
  end
end
