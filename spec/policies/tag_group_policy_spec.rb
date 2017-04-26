require 'rails_helper'

describe TagGroupPolicy do
  let(:project) { create :project }
  let(:pundit_context) { PunditContext.new(current_team, current_user, current_project: project) }
  let(:current_team) { current_user.teams.first }
  let(:policy_scope) { described_class::Scope.new(pundit_context, TagGroup).resolve.all }
  let(:tag_group) {create :tag_group }

  subject { described_class.new(pundit_context, project) }

  context "proper user of a tag group" do
    before do
      project.users << current_user
      current_team.ownerships.create(project: project, is_owner: true)
      3.times { current_team.tag_groups << [tag_group] }
    end

    context "for an admin" do
      let(:current_user) { create :user, :with_team_and_is_admin }

      %i[index show create new update edit].each do |action|
        it { is_expected.to permit(action) }
      end

      it 'lists all tag groups' do
        expect(policy_scope).to match(current_team.tag_groups)
      end
    end

    context "for a user" do
      let(:current_user) { create :user, :with_team }

      %i[index show create new update edit].each do |action|
        it { is_expected.not_to permit(action) }
      end

      it 'does not list tag groups' do
        expect(policy_scope).to eq([])
      end
    end
  end
end
