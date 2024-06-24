class Change < Struct.new(:attribute, :old, :new)
  def self.from activity
    changes = activity.subject_changes
    changes.delete_if { |key| key =~ /_(at|id|initials)$/ }

    if changes.keys.include?("state")
      changes.delete_if { |key| %w[positioning_column cycle_time position].include?(key) }
    end

    changes.map do |attribute, (old, new)|
      self.new(attribute, old, new)
    end.compact
  end

  def to_partial_path
    "activities/change"
  end
end
