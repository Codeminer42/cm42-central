class DeviseCreateUsers < ActiveRecord::Migration[4.2]
  def self.up
    create_table(:users) do |t|
      ## Database authenticatable
      t.string :email, limit: 255, null: false, default: ""
      t.string :encrypted_password, limit: 128, null: false, default: ""
      t.string :password_salt, limit: 255

      ## Recoverable
      t.string   :reset_password_token, limit: 255
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.string  :remember_token, limit: 255
      t.datetime :remember_created_at

      ## Trackable
      t.integer  :sign_in_count, default: 0
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip, limit: 255
      t.string   :last_sign_in_ip, limit: 255

      ## Confirmable
      t.string   :confirmation_token, limit: 255
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      # t.string   :unconfirmed_email # Only if using reconfirmable

      # t.encryptable
      # t.lockable lock_strategy: :failed_attempts, unlock_strategy: :both
      # t.token_authenticatable

      t.timestamps
    end

    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token,   unique: true
    # add_index :users, :unlock_token,         unique: true
  end

  def self.down
    drop_table :users
  end
end
