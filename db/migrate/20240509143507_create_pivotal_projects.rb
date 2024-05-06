class CreatePivotalProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :pivotal_projects do |t|
      t.string :name
      t.text :users_attributes
      t.datetime :started_at

      t.timestamps
    end
  end
end
