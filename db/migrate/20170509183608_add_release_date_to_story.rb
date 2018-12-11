class AddReleaseDateToStory < ActiveRecord::Migration[4.2]
  def change
    add_column :stories, :release_date, :date
  end
end
