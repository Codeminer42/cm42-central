class SetProjectDefaultScaleToPivotal < ActiveRecord::Migration[7.1]
  def change
    change_column :projects, :point_scale, :string, default: "fibonacci"
  end
end
