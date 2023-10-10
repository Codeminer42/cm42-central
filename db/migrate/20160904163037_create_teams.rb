class CreateTeams < ActiveRecord::Migration[4.2]
  def up
    create_table :teams do |t|
      t.string :name, limit: 255, null: false
      t.string :slug, limit: 255
      t.string :logo, limit: 255
      t.datetime :archived_at

      t.timestamps
    end
    add_index :teams, :name, unique: true
    add_index :teams, :slug, unique: true

    unless Rails.env.production?
      Team.create(name: 'Default Team', slug: 'default-team')
    end
  end

  def down
    remove_index :teams, :name
    remove_index :teams, :slug
    drop_table :teams
  end
end
