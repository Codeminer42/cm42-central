class AddVelocityStrategyToProjects < ActiveRecord::Migration[4.2]
  def change
    add_column :projects, :velocity_strategy, :integer, default: 3
  end
end
