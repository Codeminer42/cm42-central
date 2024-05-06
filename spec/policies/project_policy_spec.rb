require 'rails_helper'

describe ProjectPolicy do
  let(:project) { create :project }
  let(:pundit_context) { PunditContext.new(project, current_user) }
  let(:policy_scope) { ProjectPolicy::Scope.new(pundit_context, Project).resolve.all }
  subject { ProjectPolicy.new(pundit_context, project) }

  let!(:archived_project) do
    create :project, users: [current_user], archived_at: Time.current
  end

  context 'admin user of project' do
    before do
      project.users << current_user
    end

    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      %i[index show create new update edit].each do |action|
        it { should permit(action) }
      end

      %i[
        import
        import_upload
        archive
        unarchive
        destroy
      ].each do |action|
        it { should permit(action) }
      end
    end
  end

  context 'member of a project' do
    before do
      project.users << current_user
    end

    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      %i[index show create new update edit reports archived].each do |action|
        it { should permit(action) }
      end

      %i[
        import
        import_upload
        archive
        unarchive
        destroy
      ].each do |action|
        it { should permit(action) }
      end

      it 'lists all projects' do
        expect(policy_scope).to match_array([project, archived_project])
      end
    end

    context 'for a user' do
      let(:current_user) { create :user }

      %i[show reports].each do |action|
        it { should permit(action) }
      end

      %i[index create new update edit].each do |action|
        it { should_not permit(action) }
      end

      %i[
        import
        import_upload
        archive
        unarchive
        destroy
      ].each do |action|
        it { should_not permit(action) }
      end

      it 'lists all projects' do
        expect(policy_scope).to match_array([project])
      end
    end
  end

  context 'user not a member of project' do
    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      %i[index show create new update edit reports].each do |action|
        it { should permit(action) }
      end

      %i[
        import
        import_upload
        archive
        unarchive
        destroy
      ].each do |action|
        it { should permit(action) }
      end

      it 'lists all projects' do
        expect(policy_scope).to match_array([project, archived_project])
      end
    end

    context 'for a user' do
      let(:current_user) { create :user }

      %i[index create new update edit reports].each do |action|
        it { should_not permit(action) }
      end

      %i[
        import
        import_upload
        archive
        unarchive
        destroy
      ].each do |action|
        it { should_not permit(action) }
      end

      it 'hides project' do
        expect(policy_scope).to eq([])
      end
    end

    context 'for a guest' do
      let(:current_user) { create :user, role: 'guest' }

      %i[index create new update edit reports].each do |action|
        it { should_not permit(action) }
      end

      %i[
        import
        import_upload
        archive
        unarchive
        destroy
      ].each do |action|
        it { should_not permit(action) }
      end

      it 'hides project' do
        expect(policy_scope).to eq([])
      end
    end
  end
end
