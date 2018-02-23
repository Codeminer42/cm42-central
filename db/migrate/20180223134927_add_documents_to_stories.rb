class AddDocumentsToStories < ActiveRecord::Migration
  def change
    add_column :stories, :documents_id, :string
    add_column :stories, :documents_filename, :string
    add_column :stories, :documents_size, :string
    add_column :stories, :documents_content_type, :string
  end
end
