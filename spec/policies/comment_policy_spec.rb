require 'rails_helper'

describe CommentPolicy do
  let(:other_member) { create :user, name: 'Anyone' }
  let(:comment) { create :comment, story: story }
  let(:story) { create :story, project: project, requested_by: other_member }
  let(:project) { create :project }
  let(:pundit_context) do
    PunditContext.new(project, current_user, current_story: story)
  end
  let(:policy_scope) { CommentPolicy::Scope.new(pundit_context, Comment).resolve.all }

  subject { CommentPolicy.new(pundit_context, comment) }

  before do
    project.users << other_member
  end

  context 'user is a member of a project' do
    before do
      project.users << current_user
    end

    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      %i[index show create new update edit destroy].each do |action|
        it { should permit(action) }
      end

      it 'lists all comments' do
        expect(policy_scope).to eq([comment])
      end
    end

    context 'for a user' do
      let(:current_user) { create :user }

      it { should permit(:show) }

      %i[index show create new update edit destroy].each do |action|
        it { should permit(action) }
      end

      it 'lists all comments' do
        expect(policy_scope).to eq([comment])
      end
    end
  end

  context 'user not a member of project' do
    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      %i[index show create new update edit destroy].each do |action|
        it { should permit(action) }
      end

      it 'lists all comments' do
        expect(policy_scope).to eq([comment])
      end
    end

    context 'for a user' do
      let(:current_user) { create :user }

      %i[index create new update edit destroy].each do |action|
        it { should_not permit(action) }
      end

      it 'lists no comments' do
        expect(policy_scope).to eq([])
      end
    end
  end
end
