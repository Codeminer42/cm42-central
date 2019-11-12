# TODO: Change the class name to ChangedValidator when remove cm42-central-support gem
class SubjectChangedValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return if record.action != 'update' 
    return if value&.valid? && value&.saved_changes.present?
      
    record.errors[attribute] << ( options[:message] || "Record didn't change" )
  end
end
