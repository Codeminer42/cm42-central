class AddLogoToTeams < ActiveRecord::Migration
  def change
    add_column :teams, :logo_id, :string
    add_column :teams, :logo_filename, :string
    add_column :teams, :logo_size, :string
    add_column :teams, :logo_content_type, :string
  end
end
