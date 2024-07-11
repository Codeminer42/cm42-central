require 'rails_helper'

describe CommentOperations::Save do
  describe '#call' do
    subject { -> { described_class.call(story: story, comment_attrs: comment_params, current_user: user) } }

    let(:membership) { create(:membership) }
    let(:user)       { membership.user }
    let(:project)    { membership.project }
    let(:story)      { create(:story, project: project, requested_by: user) }

    context 'with valid comment' do
      let(:comment_params) do
        { body: 'name', user: user}
      end

      it 'saves comment' do
        expect { subject.call }.to change { Comment.count }.by(1)
      end

      it 'sends user notification' do
        expect(CommentOperations::UserNotification).to receive(:notify_users).with(comment: instance_of(Comment), current_user: user)
        subject.call
      end

      it 'creates activity recording' do
        expect { subject.call }.to change { Activity.count }.by(1)
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end

      it 'returns created story' do
        expect(subject.call.success).to eq(Comment.last)
      end
    end

    context 'with invalid comment' do
      let(:comment_params) do
        { body: '', user: user}
      end

      it 'does not save comment' do
        expect { subject.call }.to_not change { Comment.count }
      end

      it 'does not send user notification' do
        expect(CommentOperations::UserNotification).to_not receive(:notify_users).with(comment: instance_of(Comment), current_user: user)
        subject.call
      end

      it 'does not create activity recording' do
        expect { subject.call }.to_not change { Activity.count }
      end

      it 'returns failure' do
        expect(subject.call.failure?).to be(true)
      end
    end
  end
end
