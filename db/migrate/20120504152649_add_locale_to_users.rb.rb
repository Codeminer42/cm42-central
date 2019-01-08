class AddLocaleToUsers < ActiveRecord::Migration[4.2]
  def self.up
    add_column :users, :locale, :string
  end

  def self.down
    remove_column :users, :locale
  end
end
