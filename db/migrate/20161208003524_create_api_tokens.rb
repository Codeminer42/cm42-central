class CreateApiTokens < ActiveRecord::Migration[4.2]
  def change
    create_table :api_tokens do |t|
      t.integer :team_id
      t.string :token

      t.timestamps null: false
    end

    add_index :api_tokens, :team_id
  end
end
