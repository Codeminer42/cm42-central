class UserBelongsToProjectValidator < ActiveModel::EachValidator
  # TODO: Change de name class to BelongsToProjectValidator when remove support gem
  # Checks that the parameter being validated represents a User#id that
  # is a member of the object.project
  def validate_each(record, attribute, value)
    if record.project && !value.nil?
      unless record.project.user_ids.include?(value)
        record.errors[attribute] << 'user is not a member of this project'
      end
    end
  end
end
