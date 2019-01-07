class CreateChangesets < ActiveRecord::Migration[4.2]
  def self.up
    create_table :changesets do |t|
      t.references :story
      t.references :project

      t.timestamps
    end
  end

  def self.down
    drop_table :changesets
  end
end
