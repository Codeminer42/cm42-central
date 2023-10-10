class CreateIntegrations < ActiveRecord::Migration[4.2]
  def change
    enable_extension "hstore"
    enable_extension "pg_stat_statements"

    create_table :integrations do |t|
      t.belongs_to :project
      t.string :kind, limit: 255, null: false
      t.hstore :data, null: false

      t.timestamps
    end
    add_index  :integrations, :data, using: :gin
  end
end
