class CreateTagGroups < ActiveRecord::Migration[4.2]
  def change
    create_table :tag_groups do |t|
      t.integer :team_id, index: true
      t.string :name, limit: 15
      t.text :description
      t.string :bg_color, default: "#2075F3"
      t.timestamps null: false
    end
  end
end
