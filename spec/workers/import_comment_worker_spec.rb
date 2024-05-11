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

describe ImportCommentWorker do
  let!(:project) { Project.create!(name: "Clients") }
  let!(:story) { project.stories.create!(title: "Problem replying to emails?") }
  let!(:user) { create :user, name: "Micah Geisel", email: "micah@botandrose.com", projects: [project] }

  let(:comment) do
    comment = Comment.new(id: 1, smtp_id: "reply.eml")
    comment.save(validate: false)
    comment
  end

  before do
    stub_const("IncomingEmail", FixtureIncomingEmail)
  end

  it "sets story, user, comment, and destroys incoming email" do
    subject.perform(comment.id)
    comment.reload
    expect(comment.attributes).to include({
      "story_id" => story.id,
      "user_id" => user.id,
      "user_name" => user.name,
      "body" => "testing reply 3",
    })
    expect(FixtureIncomingEmail.find(comment.smtp_id)).to be_destroyed
  end
end

