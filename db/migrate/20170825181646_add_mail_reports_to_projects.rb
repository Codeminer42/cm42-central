class AddMailReportsToProjects < ActiveRecord::Migration[4.2]
  def change
    add_column :projects, :mail_reports, :boolean, default: true
  end
end
