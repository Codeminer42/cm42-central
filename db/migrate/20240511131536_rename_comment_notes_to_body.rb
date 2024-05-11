class RenameCommentNotesToBody < ActiveRecord::Migration[7.1]
  def change
    rename_column :comments, :note, :body
  end
end
