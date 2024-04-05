require 'rails_helper'

describe ProjectOperations::Update do
  describe '#call' do
    subject { -> { ProjectOperations::Update.call(project: project, project_attrs: project_params, current_user: user) } }

    let(:membership) { create(:membership) }
    let(:user)        { membership.user }
    let(:project)     { membership.project }

    context 'with valid project' do
      let(:project_params) do
        { name: 'Project updated name' }
      end

      it 'updates project' do
        expect(subject.call.success.name).to eq(project_params[:name])
      end

      it 'truncates story points' do
        expect(StoryOperations::TruncatePoints).to receive(:call)
        subject.call
      end

      it 'creates activity recording' do
        expect { subject.call }.to change { Activity.count }.by(1)
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end
    end

    context 'with invalid project' do
      let(:project_params) do
        { name: '' }
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
