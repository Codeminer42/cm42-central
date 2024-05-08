require 'rails_helper'

describe ChangesetPolicy do
  let(:project) { create :project }
  let(:pundit_context) { PunditContext.new(project, current_user) }
  let(:policy_scope) { ChangesetPolicy::Scope.new(pundit_context, Project).resolve.all }
  subject { ChangesetPolicy.new(pundit_context, project) }

  context 'proper user of a project' do
    before do
      project.users << current_user
    end

    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      it 'lists all projects' do
        expect(policy_scope).to eq([project])
      end
    end

    context 'for a user' do
      let(:current_user) { create :user }

      it 'lists all projects' do
        expect(policy_scope).to eq([project])
      end
    end
  end

  context 'user not a member of project' do
    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      it 'lists all projects' do
        expect(policy_scope).to eq([project])
      end
    end

    context 'for a user' do
      let(:current_user) { create :user }

      it 'hides project' do
        expect(policy_scope).to eq([])
      end
    end
  end
end
