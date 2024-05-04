require 'rails_helper'

describe Notifications do
  before do
    described_class.default_url_options[:host] = "email.com"
    described_class.default from: sender
  end

  let(:sender) { "notifications@email.com" }
  let(:requested_by) { mock_model(User, email: 'requested_by@email.com') }
  let(:owned_by) { mock_model(User, name: 'Developer', email: 'owned_by@email.com') }
  let(:project) { mock_model(Project, name: 'Test Project') }
  let(:story) do
    mock_model(
      Story, title: 'Test story', requested_by: requested_by,
             owned_by: owned_by, project: project,
             story_type: 'feature'
    )
  end

  describe '#story_changed with invalid state' do
    before { allow(story).to receive_messages(state: :invalid_state) }
    subject { Notifications.story_changed(story, double).__getobj__ }

    it { is_expected.to be_a ActionMailer::Base::NullMail }
  end

  describe '#story_changed to started' do
    before { allow(story).to receive_messages(state: :started) }
    subject { Notifications.story_changed(story, owned_by) }

    its(:subject) { should match "[Test Project] Test story" }
    its(:to)      { should match [requested_by.email] }
    its(:from)    { should match [sender] }
    its(:body)    { should match project_url(project, host: "email.com") }
    its(:body)    { should match "Developer has started your story 'Test story'." }

    context 'with story without estimation' do
      its(:body) do
        should match 'This story is NOT estimated. Ask Developer to add proper estimation ' \
          'before implementation!'
      end
    end

    context 'with story with estimation' do
      before { allow(story).to receive_messages(estimate: 10) }

      its(:body) { should match 'The estimation of this story is 10 points.' }
    end

    context 'with a bug story' do
      before { allow(story).to receive_messages(story_type: 'bug') }

      its(:body) do
        should match 'This is either a bug or a chore There is no estimation. ' \
          'Expect the sprint velocity to decrease.'
      end
    end
  end

  describe '#story_changed to delivered' do
    let(:delivered_by) { mock_model(User, name: 'Deliverer', email: 'delivered_by@email.com') }
    before { allow(story).to receive_messages(state: :delivered) }
    subject  { Notifications.story_changed(story, delivered_by) }

    its(:subject) { should match "[Test Project] Test story" }
    its(:to)      { should match [requested_by.email] }
    its(:from)    { should match [sender] }
    its(:body)    { should match "Deliverer has delivered your story 'Test story'." }
    its(:body)    { should match 'You can now review the story, and either accept or reject it.' }
    its(:body)    { should match project_url(project, host: "email.com") }
  end

  describe '#story_changed to accepted' do
    let(:accepted_by) { mock_model(User, name: 'Accepter', email: 'accerpter@email.com') }

    before { allow(story).to receive_messages(state: :accepted) }
    subject { Notifications.story_changed(story, accepted_by) }

    its(:subject) { should match "[Test Project] Test story" }
    its(:to)      { should match [owned_by.email] }
    its(:from)    { should match [sender] }
    its(:body)    { should match "Accepter has accepted the story 'Test story'." }
    its(:body)    { should match project_url(project, host: "email.com") }
  end

  describe '#story_changed to rejected' do
    let(:rejected_by) { mock_model(User, name: 'Rejecter', email: 'rejecter@email.com') }

    before { allow(story).to receive_messages(state: :rejected) }
    subject { Notifications.story_changed(story, rejected_by) }

    its(:subject) { should match "[Test Project] Test story" }
    its(:to)      { should match [owned_by.email] }
    its(:from)    { should match [sender] }
    its(:body)    { should match "Rejecter has rejected the story 'Test story'." }
    its(:body)    { should match project_url(project, host: "email.com") }
  end

  describe '#new_note' do
    let(:notify_users)  { [mock_model(User, email: 'foo@example.com')] }
    let(:user)          { mock_model(User, name: 'Note User') }
    let(:note)          { mock_model(Note, story: story, user: user) }

    subject { Notifications.new_note(note, notify_users.map(&:email)) }
    before { allow(Note).to receive_message_chain(:includes, :find).and_return(note) }

    its(:subject) { should match "[Test Project] Test story" }
    its(:to)      { ['foo@example.com'] }
    its(:from)    { [sender] }

    specify do
      expect(subject.body.encoded).to match('Note User added the following comment to the story')
    end
  end

  describe '#archived_team' do
    let(:users_emails) { ['user1@codeminer42.com', 'user2@codeminer42.com'] }
    let(:users) { class_double(User, pluck: users_emails) }
    let(:team) { build(:team, name: 'Team1') }
    let(:mail) { described_class.archived_team(team) }

    before do
      allow(team).to receive(:users).and_return(users)
    end

    it 'delivery to all team members' do
      expect(mail.to).to eq([users_emails.first])
      expect(mail.bcc).to eq([users_emails.second])
    end

    it 'have the right subject' do
      expect(mail.subject).to eq("The team <#{team.name}> was archived")
    end
  end
end
