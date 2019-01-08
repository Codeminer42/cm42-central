class InstallPgTrgmContribPackage < ActiveRecord::Migration[4.2]
  def up
    execute "CREATE EXTENSION pg_trgm;"
  end

  def down
    execute "DROP EXTENSION pg_trgm;"
  end
end
