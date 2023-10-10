class AddNameAndInitialsToUsers < ActiveRecord::Migration[4.2]
  def self.up
    add_column :users, :name, :string, limit: 255
    add_column :users, :initials, :string, limit: 255
  end

  def self.down
    remove_column :users, :initials
    remove_column :users, :name
  end
end
