class ReceiveEmailsWorker
  include Sidekiq::Worker

  def perform
    IncomingEmail.all.each do |incoming_email|
      note = Note.where(smtp_id: incoming_email.id).first_or_initialize
      note.save(validate: false) if note.new_record?
      ImportNoteWorker.perform_async(note.id)
    end
  end
end
