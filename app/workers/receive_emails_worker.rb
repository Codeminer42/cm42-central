class ReceiveEmailsWorker
  include Sidekiq::Worker

  def perform
    IncomingEmail.all.each do |incoming_email|
      comment = Comment.where(smtp_id: incoming_email.id).first_or_initialize
      comment.save(validate: false) if comment.new_record?
      ImportCommentWorker.perform_async(comment.id)
    end
  end
end
