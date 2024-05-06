class AddPositionToTasks < ActiveRecord::Migration[7.1]
  def change
    add_column :tasks, :position, :integer
  end
end
