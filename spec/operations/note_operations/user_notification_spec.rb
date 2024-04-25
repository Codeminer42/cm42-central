require 'rails_helper'

describe NoteOperations::UserNotification do
  describe '#notify_users' do
    subject { -> { NoteOperations::UserNotification.notify_users(note: note, current_user: user) }}

    let(:membership)  { create(:membership) }
    let(:user)        { membership.user }
    let(:project)     { membership.project }
    let(:story)       { create(:story, project: project, requested_by: user) }
    let(:note)        { create(:note, story: story) }

    let(:note_params) do
      { note: 'name', user: user}
    end

    let(:users_to_notify) { [note.user.email] }
    let(:notifier) { double('notifier') }

    it 'sends notification', :aggregate_failures do
      expect(Notifications).to receive(:new_note).with(note, users_to_notify).and_return(notifier)
      expect(notifier).to receive(:deliver_later)

      subject.call
    end

    context 'when user is nil' do
      let(:note)        { create(:note, :without_user, story: story) }

      it 'does not send notification' do
        expect(Notifications).to_not receive(:new_note)

        subject.call
      end
    end

    context 'when notification is suppressed' do
      it 'does not send notification' do
        allow(note).to receive_message_chain(:story, :suppress_notifications).and_return(true)
        expect(Notifications).to_not receive(:new_note)

        subject.call
      end
    end

    context 'when theres no users to notify' do
      it 'does not send notification' do
        allow(story).to receive(:stakeholders_users).and_return([])
        expect(Notifications).to_not receive(:new_note)

        subject.call
      end
    end

    context 'when theres mentioned user in note' do
      let(:mentioned_user) { create(:user, username: 'mentioned_username', projects: [project]) }
      let(:note)        { create(:note, story: story, note: "Some text @mentioned_username") }
      let(:users_to_notify) { [note.user.email, mentioned_user.email] }

      it 'sends notitication to the mentioned user', :aggregate_failures do
        expect(Notifications).to receive(:new_note).with(note, users_to_notify).and_return(notifier)
        expect(notifier).to receive(:deliver_later)

        subject.call
      end
    end
  end
end
