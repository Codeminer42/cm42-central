class CreateEnrollments < ActiveRecord::Migration[4.2]
  def up
    create_table :enrollments do |t|
      t.integer :team_id, null: false
      t.integer :user_id, null: false
      t.boolean :is_admin, null: false, default: false

      t.timestamps
    end
    add_foreign_key :enrollments, :teams, name: "enrollments_team_id_fk", on_delete: :cascade
    add_foreign_key :enrollments, :users, name: "enrollments_user_id_fk", on_delete: :cascade
    add_index :enrollments, [:team_id, :user_id], unique: true

    unless Rails.env.production?
      team = Team.find_by_slug('default-team')
      User.select(:id, :is_admin).find_each do |user|
        Enrollment.create(team_id: team.id, user_id: user.id, is_admin: user.is_admin)
      end
    end
  end

  def down
    remove_index :enrollments, [:team_id, :user_id]
    remove_foreign_key :enrollments, :teams, name: "enrollments_team_id_fk"
    remove_foreign_key :enrollments, :users, name: "enrollments_user_id_fk"
    drop_table :enrollments
  end
end
