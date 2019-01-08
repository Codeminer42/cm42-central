class AddTimeZoneToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :time_zone, :string, null: false, default: 'Brasilia'
  end
end
