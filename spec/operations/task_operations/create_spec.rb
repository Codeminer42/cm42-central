require 'rails_helper'

describe TaskOperations::Create do
  describe '#call' do
    subject { -> { TaskOperations::Create.call(task: task, current_user: user) }}

    let(:membership)      { create(:membership) }
    let(:user)            { membership.user }
    let(:project)         { membership.project }
    let(:story)           { create(:story, project: project, requested_by: user) }
    let(:task)            { build(:task, task_params) }

    context 'with valid task' do
      let(:task_params) { { name: 'Task', story: story } }

      it 'saves task' do
        expect { subject.call }.to change { Task.count }.by(1)
      end

      it 'creates changesets' do
        expect { subject.call }.to change { Changeset.count }.by(1)
      end

      it 'creates activity recording' do
        expect { subject.call }.to change { Activity.count }.by(1)
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end

      it 'returns created task' do
        expect(subject.call.success).to eq(Task.last)
      end
    end

    context 'with invalid task' do
      let(:task_params) { { name: '', story: story } }

      it 'does not save task' do
        expect { subject.call }.to_not change { Task.count }
      end

      it 'does not create changesets' do
        expect { subject.call }.to_not change { Changeset.count }
      end

      it 'does not create activity recording' do
        expect { subject.call }.to_not change { Activity.count }
      end

      it 'returns failure' do
        expect(subject.call.failure?).to be(true)
      end

      it 'returns task with errors' do
        expect(subject.call.failure.errors.full_messages).to eq(['Name can\'t be blank'])
      end
    end
  end
end
