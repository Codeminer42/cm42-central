class EstimateValidator < ActiveModel::EachValidator
  # Checks that the estimate being validated is valid for record.project
  def validate_each(record, attribute, value)
    return if record.project.blank?

    return if record.project.point_values.include?(value)

    record.errors.add(attribute, message: 'is not an allowed value for this project')
  end
end
