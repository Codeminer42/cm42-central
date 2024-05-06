class AddReactionsToNotes < ActiveRecord::Migration[7.1]
  def change
    add_column :notes, :reactions, :mediumtext
  end
end
