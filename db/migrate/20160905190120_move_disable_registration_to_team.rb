class MoveDisableRegistrationToTeam < ActiveRecord::Migration[4.2]
  def change
    add_column :teams, :disable_registration, :boolean, null: false, default: false
    add_column :teams, :registration_domain_whitelist, :string, limit: 255
    add_column :teams, :registration_domain_blacklist, :string, limit: 255
  end
end
