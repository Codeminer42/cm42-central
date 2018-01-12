class AttachmentsController < ApplicationController
  include 

  skip_after_action :verify_authorized
  def attachments_signature
    attachinary_file_field_options(Story.new, :documents, cloudinary: { use_filename: true })
  end
  def signature
    render json: attachments_signature.to_json
  end

end
