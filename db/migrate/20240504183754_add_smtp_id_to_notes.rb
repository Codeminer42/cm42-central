class AddSmtpIdToNotes < ActiveRecord::Migration[7.1]
  def change
    add_column :notes, :smtp_id, :string
    add_index :notes, :smtp_id, unique: true, where: 'smtp_id IS NOT NULL'
  end
end
