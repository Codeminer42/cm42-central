class AddDefaultVelocityToProjects < ActiveRecord::Migration[4.2]
  def self.up
    add_column :projects, :default_velocity, :integer, default: 10
  end

  def self.down
    remove_column :projects, :default_velocity
  end
end
