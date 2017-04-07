class IncreasePositionDecimalPrecisionToStories < ActiveRecord::Migration
  def change
    change_column :stories, :position, :decimal, precision: 25, scale: 20
  end
end
