module AttachinaryOptions
  include Attachinary::ViewHelpers
  
  def attachinary_field_options
    attachinary_file_field_options(Story.new, :documents, cloudinary: { use_filename: true }).to_json
  end
end