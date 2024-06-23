class Change < Struct.new(:attribute, :old, :new)
  def self.from activity
    changes = activity.subject_changes
    changes.delete_if { |key| key.ends_with?("_at") }

    if changes.keys.include?("state")
      changes.delete_if { |key| %w[positioning_column cycle_time position].include?(key) }
    end

    if changes.keys.include?("owned_by_name")
      changes.delete_if { |key| %w[owned_by_id owned_by_initials].include?(key) }
    end

    changes.map do |attribute, (old, new)|
      self.new(attribute, old, new)
    end.compact
  end

  def to_partial_path
    "activities/change"
  end
end
