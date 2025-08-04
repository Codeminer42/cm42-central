class ChangedValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if record.action != 'update'
    return if value&.valid? && value&.saved_changes.present?

    record.errors.add(attribute, message: (options[:message] || "Record didn't change"))
  end
end
