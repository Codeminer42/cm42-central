class IncreasePositionDecimalPrecisionToStories < ActiveRecord::Migration[4.2]
  def change
    change_column :stories, :position, :decimal, precision: 25, scale: 20
  end
end
