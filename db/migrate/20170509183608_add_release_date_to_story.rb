class AddReleaseDateToStory < ActiveRecord::Migration
  def change
    add_column :stories, :release_date, :date
  end
end
