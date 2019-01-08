class AddFinishedTourToUsers < ActiveRecord::Migration[4.2]
  def self.up
    add_column :users, :finished_tour, :boolean, default: false
  end

  def self.down
    remove_column :users, :finished_tour
  end
end
