class AddTourAndTourStepsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :tour, :boolean, default: true
    add_column :users, :tour_steps, :text
  end
end
