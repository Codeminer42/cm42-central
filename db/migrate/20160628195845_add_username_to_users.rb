class AddUsernameToUsers < ActiveRecord::Migration[4.2]
  def self.up
    add_column :users, :username, :string, limit: 255, null: false, default: ''
  end

  def self.down
    remove_column :users, :username
  end
end
