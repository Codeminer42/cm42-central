require 'rails_helper'

describe TaskPolicy do
  let(:other_member) { create :user, name: 'Anyone' }
  let(:task) { create :task, story: story }
  let(:story) { create :story, project: project, requested_by: other_member }
  let(:project) { create :project }
  let(:pundit_context) do
    PunditContext.new(project, current_user, current_story: story)
  end
  let(:policy_scope) { TaskPolicy::Scope.new(pundit_context, Task).resolve.all }

  subject { TaskPolicy.new(pundit_context, task) }

  before { project.users << other_member }

  context 'proper user of a project' do
    before do
      project.users << current_user
    end

    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      %i[index show create new update edit destroy].each do |action|
        it { should permit(action) }
      end

      it 'lists all tasks' do
        expect(policy_scope).to eq([task])
      end
    end

    context 'for a user' do
      let(:current_user) { create :user }

      it { should permit(:show) }

      %i[index show create new update edit destroy].each do |action|
        it { should permit(action) }
      end

      it 'lists all tasks' do
        expect(policy_scope).to eq([task])
      end
    end
  end

  context 'user not a member of project' do
    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      %i[index show create new update edit destroy].each do |action|
        it { should permit(action) }
      end

      it 'lists all tasks' do
        expect(policy_scope).to eq([task])
      end
    end

    context 'for a user' do
      let(:current_user) { create :user }

      %i[index create new update edit destroy].each do |action|
        it { should_not permit(action) }
      end

      it 'lists no tasks' do
        expect(policy_scope).to eq([])
      end
    end
  end
end
