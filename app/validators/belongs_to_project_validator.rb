class BelongsToProjectValidator < ActiveModel::EachValidator
  # Checks that the parameter being validated represents a User#id that
  # is a member of the object.project
  def validate_each(record, attribute, value)
    return if record.project.blank? || value.blank?

    return if record.project.user_ids.include?(value)

    record.errors.add(attribute, message: 'user is not a member of this project')
  end
end
