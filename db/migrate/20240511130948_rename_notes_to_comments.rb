class RenameNotesToComments < ActiveRecord::Migration[7.1]
  def change
    rename_table :notes, :comments
  end
end
