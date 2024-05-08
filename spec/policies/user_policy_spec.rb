require 'rails_helper'

describe UserPolicy do
  let(:other_member) { create :user, name: 'Anyone' }
  let(:project) { create :project }
  let(:pundit_context) { PunditContext.new(project, current_user) }
  let(:policy_scope) { UserPolicy::Scope.new(pundit_context, User).resolve.all }
  subject { UserPolicy.new(pundit_context, other_member) }

  before { project.users << other_member }

  context 'proper user of a project' do
    before do
      project.users << current_user
    end

    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      %i[index show create new destroy].each do |action|
        it { should permit(action) }
      end

      it 'lists all members' do
        expect(policy_scope.sort).to eq([other_member, current_user].sort)
      end
    end

    context 'for a user but not acting on himself' do
      let(:current_user) { create :user }

      it { should permit(:index) }
      it { should permit(:show) }

      %i[create new edit destroy].each do |action|
        it { should_not permit(action) }
      end

      it 'lists all members' do
        expect(policy_scope.pluck(:id).sort).to eq([other_member.id, current_user.id].sort)
      end
    end

    context 'for a user acting on himself' do
      let(:current_user) { create :user }
      subject { UserPolicy.new(pundit_context, current_user) }

      %i[index show edit update destroy].each do |action|
        it { is_expected.to permit(action) }
      end

      %i[create new].each do |action|
        it { is_expected.not_to permit(action) }
      end
    end
  end

  context 'user not a member of project' do
    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      %i[index show create new destroy].each do |action|
        it { should permit(action) }
      end

      it 'lists all members' do
        expect(policy_scope.pluck(:id)).to eq([other_member.id, current_user.id])
      end
    end

    context 'for a user' do
      let(:current_user) { create :user }

      %i[index create new destroy].each do |action|
        it { should_not permit(action) }
      end

      it 'hides project' do
        expect(policy_scope).to eq([])
      end
    end
  end
end
