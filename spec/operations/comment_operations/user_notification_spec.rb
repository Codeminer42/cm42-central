require 'rails_helper'

describe CommentOperations::UserNotification do
  describe '#notify_users' do
    subject { -> { CommentOperations::UserNotification.notify_users(comment: comment, current_user: user) }}

    let(:membership)  { create(:membership) }
    let(:user)        { membership.user }
    let(:project)     { membership.project }
    let(:story)       { create(:story, project: project, requested_by: user) }
    let(:comment)     { create(:comment, story: story) }

    let(:comment_params) do
      { body: 'name', user: user}
    end

    let(:users_to_notify) { [comment.user.email] }
    let(:notifier) { double('notifier') }

    it 'sends notification', :aggregate_failures do
      expect(Notifications).to receive(:new_comment).with(comment.user.email, comment).and_return(notifier)
      expect(notifier).to receive(:deliver_later)

      subject.call
    end

    context 'when user is nil' do
      let(:comment) { create(:comment, :without_user, story: story) }

      it 'does not send notification' do
        expect(Notifications).to_not receive(:new_comment)

        subject.call
      end
    end

    context 'when notification is suppressed' do
      it 'does not send notification' do
        allow(comment).to receive_message_chain(:story, :suppress_notifications).and_return(true)
        expect(Notifications).to_not receive(:new_comment)

        subject.call
      end
    end

    context 'when theres no users to notify' do
      it 'does not send notification' do
        allow(story).to receive(:stakeholders_users).and_return([])
        expect(Notifications).to_not receive(:new_comment)

        subject.call
      end
    end

    context 'when theres mentioned user in comment' do
      let(:mentioned_user) { create(:user, username: 'mentioned_username', projects: [project]) }
      let(:comment)        { create(:comment, story: story, body: "Some text @mentioned_username") }
      let(:users_to_notify) { [comment.user.email, mentioned_user.email] }

      it 'sends notitication to the mentioned user', :aggregate_failures do
        expect(Notifications).to receive(:new_comment).with(comment.user.email, comment).and_return(notifier)
        expect(Notifications).to receive(:new_comment).with(mentioned_user.email, comment).and_return(notifier)
        expect(notifier).to receive(:deliver_later).twice

        subject.call
      end
    end
  end
end
