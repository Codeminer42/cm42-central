class ConvertsCommentInlineImagesToAttachments < Struct.new(:comment)
  def self.call(comment)
    new(comment).call
  end

  # ![Screen Shot 2023-12-15 at 12.05.39 PM.jpg](/file_attachments/122214293/download)
  REGEX = /!\[([^]]+)\]\((\/file_attachments\/\d+\/download)\)\s*/

  def call
    return if comment.body.blank?
    comment.body.gsub!(REGEX) do
      response = attachments[$2].get
      hacky_pivotal_id = response.headers[:content_length]
      if comment.attachments.where(pivotal_id: hacky_pivotal_id).none?
        attachment = comment.attachments.attach(
          io: StringIO.new(response.body),
          filename: $1,
          content_type: response.headers[:content_type],
        )
        comment.save(validate: false)
        comment.attachments_attachments.last.update!({
          created_at: comment.created_at,
          pivotal_id: hacky_pivotal_id,
        })
      end
      ""
    end
    comment.save(validate: false) if comment.body_changed?
  end


  def attachments
    @attachments ||= RestClient::Resource.new("https://www.pivotaltracker.com", headers: { "X-TrackerToken" => Rails.application.credentials.pivotal_tracker_api_token })
  end
end
