require 'rails_helper'

describe NoteOperations::Create do
  describe '#call' do
    subject { -> { NoteOperations::Create.call(story: story, note_attrs: note_params, current_user: user) } }

    let(:membership) { create(:membership) }
    let(:user)       { membership.user }
    let(:project)    { membership.project }
    let(:story)      { create(:story, project: project, requested_by: user) }

    context 'with valid note' do
      let(:note_params) do
        { note: 'name', user: user}
      end

      it 'saves note' do
        expect { subject.call }.to change { Note.count }.by(1)
      end

      it 'creates changesets' do
        expect { subject.call }.to change { Changeset.count }.by(1)
      end

      it 'sends user notification' do
        expect(NoteOperations::UserNotification).to receive(:notify_users).with(note: instance_of(Note), current_user: user)
        subject.call
      end

      it 'creates activity recording' do
        expect { subject.call }.to change { Activity.count }.by(1)
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end

      it 'returns created story' do
        expect(subject.call.success).to eq(Note.last)
      end
    end

    context 'with invalid note' do
      let(:note_params) do
        { note: '', user: user}
      end

      it 'does not save note' do
        expect { subject.call }.to_not change { Note.count }
      end

      it 'does not creates changesets' do
        expect { subject.call }.to_not change { Changeset.count }
      end

      it 'does not send user notification' do
        expect(NoteOperations::UserNotification).to_not receive(:notify_users).with(note: instance_of(Note), current_user: user)
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
