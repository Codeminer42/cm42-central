class AddMailReportsToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :mail_reports, :boolean, default: true
  end
end
