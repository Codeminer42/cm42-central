require 'rails_helper'

describe Beta::ProjectPolicy do
  let(:project) { create :project }
  let(:pundit_context) { PunditContext.new(current_team, current_user, current_project: project) }
  let(:current_team) { current_user.teams.first }
  let(:policy_scope) { Beta::ProjectPolicy::Scope.new(pundit_context, Project).resolve.all }
  subject { Beta::ProjectPolicy.new(pundit_context, project) }

  context 'proper access of a project in beta' do
    context 'for the project owner' do
      let(:current_user) { create :user, :with_team }

      before do
        project.users << current_user
        current_team.ownerships.create(project: project, is_owner: true)
      end

      it { should permit(:show) }
    end

    context 'for users' do
      before do
        project.users << current_user
        current_team.projects << project
      end

      context 'regular user' do
        let(:current_user) { create :user, :with_team }

        it { should_not permit(:show) }
      end

      context 'codeminer user' do
        let(:current_user) { create :user, :with_team, email: 'dummy@codeminer42.com' }

        it { should permit(:show) }
      end
    end
  end
end
