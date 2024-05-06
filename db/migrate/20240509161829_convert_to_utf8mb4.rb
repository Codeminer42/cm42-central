class ConvertToUtf8mb4 < ActiveRecord::Migration[7.1]
  def up
    execute "ALTER DATABASE `#{db.current_database}` CHARACTER SET #{charset} COLLATE #{collation};"
    db.tables.each do |table|
      execute "ALTER TABLE `#{table}` ROW_FORMAT=DYNAMIC CHARACTER SET #{charset} COLLATE #{collation};"

      db.columns(table).each do |column|
        case column.sql_type
          when /([a-z]*)text/i
            default = (column.default.blank?) ? '' : "DEFAULT '#{column.default}'"
            null = (column.null) ? '' : 'NOT NULL'
            execute "ALTER TABLE `#{table}` MODIFY `#{column.name}` #{column.sql_type.upcase} CHARACTER SET #{charset} COLLATE #{collation} #{default} #{null};"
          when /varchar\(([0-9]+)\)/i
            sql_type = column.sql_type.upcase
            default = (column.default.blank?) ? '' : "DEFAULT '#{column.default}'"
            null = (column.null) ? '' : 'NOT NULL'
            execute "ALTER TABLE `#{table}` MODIFY `#{column.name}` #{sql_type} CHARACTER SET #{charset} COLLATE #{collation} #{default} #{null};"
        end
      end
    end
  end

  def down
  end

  private

  def charset
    "utf8mb4"
  end

  def collation
    "utf8mb4_unicode_ci"
  end

  def db
    ActiveRecord::Base.connection
  end
end

