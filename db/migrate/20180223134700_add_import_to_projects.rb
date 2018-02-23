class AddImportToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :import_id, :string
    add_column :projects, :import_filename, :string
    add_column :projects, :import_size, :string
    add_column :projects, :import_content_type, :string
  end
end
