require 'rails_helper'

describe ProjectOperations::Destroy do
  describe '#call' do
    subject { -> { ProjectOperations::Destroy.call(project: project, current_user: user) } }

    let(:membership) { create(:membership) }
    let(:user)        { membership.user }
    let(:project)     { membership.project }

    it 'deletes project' do
      subject.call
      expect { Project.find(project.id) }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'creates activity recording' do
      expect { subject.call }.to change { Activity.count }.by(1)
    end

    it 'returns success' do
      expect(subject.call.success?).to be(true)
    end
  end
end
