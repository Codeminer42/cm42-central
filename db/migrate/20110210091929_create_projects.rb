class CreateProjects < ActiveRecord::Migration[4.2]
  def self.up
    create_table :projects do |t|
      t.string :name
      t.string :point_scale, default: 'fibonacci'
      t.date :start_date
      t.integer :iteration_start_day, default: 1
      t.integer :iteration_length, default: 1

      t.timestamps
    end
  end

  def self.down
    drop_table :projects
  end
end
