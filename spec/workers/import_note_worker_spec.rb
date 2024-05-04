require 'rails_helper'

class FixtureIncomingEmail < Struct.new(:id)
  def self.find id
    @map ||= {}
    @map[id] ||= new(id)
  end

  def read
    File.read("spec/fixtures/emails/#{id}")
  end

  def destroy
    @destroyed = true
  end

  def destroyed?
    @destroyed
  end
end

describe ImportNoteWorker do
  let!(:project) { Project.create!(name: "Clients") }
  let!(:story) { project.stories.create!(title: "Problem replying to emails?") }
  let!(:user) { create :user, name: "Micah Geisel", email: "micah@botandrose.com", projects: [project] }

  let(:note) do
    note = Note.new(id: 1, smtp_id: "reply.eml")
    note.save(validate: false)
    note
  end

  before do
    stub_const("IncomingEmail", FixtureIncomingEmail)
  end

  it "sets story, user, note, and destroys incoming email" do
    subject.perform(note.id)
    note.reload
    expect(note.attributes).to include({
      "story_id" => story.id,
      "user_id" => user.id,
      "user_name" => user.name,
      "note" => "testing reply 3",
    })
    expect(FixtureIncomingEmail.find(note.smtp_id)).to be_destroyed
  end
end

