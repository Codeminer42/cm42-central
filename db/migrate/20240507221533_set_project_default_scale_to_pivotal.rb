class SetProjectDefaultScaleToPivotal < ActiveRecord::Migration[7.1]
  def change
    change_column :projects, :point_scale, :string, default: "pivotal"
    change_column :projects, :mail_reports, :boolean, default: false
  end
end
