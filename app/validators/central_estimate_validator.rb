class CentralEstimateValidator < ActiveModel::EachValidator
  # TODO: Change the name to EstimateValidator when remove support gem
  # Checks that the estimate being validated is valid for record.project
  def validate_each(record, attribute, value)
    if record.project
      unless record.project.point_values.include?(value)
        record.errors.add(attribute, message: 'is not an allowed value for this project')
      end
    end
  end
end
