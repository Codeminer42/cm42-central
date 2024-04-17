class SetDefaultStoryStateToUnscheduled < ActiveRecord::Migration[6.1]
  def change
    # was unstarted
    change_column :stories, :state, :string, limit: 255, default: "unscheduled"
  end
end
