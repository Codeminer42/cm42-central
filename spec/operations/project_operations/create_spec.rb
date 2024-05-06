require 'rails_helper'

describe ProjectOperations::Create do
  describe '#call' do
    subject { -> { ProjectOperations::Create.call(project: project, current_user: user) }}

    let(:user) { create(:user) }
    let(:project) { user.projects.build(project_params) }
    let(:session) { { user_id: user.id } }
    context 'with valid project' do
      let(:project_params) do
        { name: 'Project', start_date: Date.current }
      end

      it 'saves project' do
        expect { subject.call }.to change { Project.count }.by(1)
      end

      it 'creates activity recording' do
        expect { subject.call }.to change { Activity.count }.by(1)
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end

      it 'returns created project' do
        expect(subject.call.success).to eq(Project.last)
      end
    end

    context 'with invalid project' do
      let(:project_params) do
        { name: '', start_date: Date.current }
      end

      it 'doest not save project' do
        expect { subject.call }.to_not change { Project.count }
      end

      it 'does not create activity recording' do
        expect { subject.call }.to_not change { Activity.count }
      end


      it 'returns failure' do
        expect(subject.call.failure?).to be(true)
      end

      it 'returns project with errors' do
        expect(subject.call.failure.errors.full_messages).to eq(['Name can\'t be blank'])
      end
    end
  end
end
