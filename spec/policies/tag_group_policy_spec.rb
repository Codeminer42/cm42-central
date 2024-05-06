require 'rails_helper'

describe TagGroupPolicy do
  let(:project) { create :project }
  let(:pundit_context) { PunditContext.new(project, current_user) }
  let(:policy_scope) { described_class::Scope.new(pundit_context, TagGroup).resolve.all }
  let(:tag_group) { create :tag_group }

  subject { described_class.new(pundit_context, project) }

  context 'proper user of a tag group' do
    before do
      project.users << current_user
      project.update! tag_group: tag_group
    end

    context 'for an admin' do
      let(:current_user) { create :user, :admin }

      %i[index show create new update edit].each do |action|
        it { is_expected.to permit(action) }
      end

      it 'lists all tag groups' do
        expect(policy_scope).to match(TagGroup.all)
      end
    end

    context 'for a user' do
      let(:current_user) { create :user }

      %i[index show create new update edit].each do |action|
        it { is_expected.not_to permit(action) }
      end

      it 'list project tag group' do
        expect(policy_scope).to eq([tag_group])
      end
    end
  end
end
