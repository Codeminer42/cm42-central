class AttachmentsController < ApplicationController
  include Attachinary::ViewHelpers

  skip_after_action :verify_authorized

  def signature
    render json: attachment_signature.to_json
  end

  def attachment_signature
    attachinary_file_field_options(Story.new, :documents, cloudinary: { use_filename: true })
  end
end
