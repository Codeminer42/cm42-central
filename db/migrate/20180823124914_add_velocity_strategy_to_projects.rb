class AddVelocityStrategyToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :velocity_strategy, :integer, default: 3
  end
end
