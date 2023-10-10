class AddTimeZoneToUsers < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :time_zone, :string, limit: 255, null: false, default: 'Brasilia'
  end
end
