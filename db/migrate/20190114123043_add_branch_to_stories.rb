class AddBranchToStories < ActiveRecord::Migration[5.2]
  def change
    add_column :stories, :branch, :string
  end
end
