require 'rails_helper'

describe User do
  describe 'validations' do
    it 'requires a name' do
      subject.name = ''
      subject.valid?
      expect(subject.errors[:name].size).to eq(1)
    end

    it 'requires initials' do
      subject.initials = ''
      subject.valid?
      expect(subject.errors[:initials].size).to eq(1)
    end

    it { is_expected.to validate_inclusion_of(:role).in_array(User::ROLES) }
  end

  describe 'associations' do
    it { is_expected.to have_many(:enrollments) }
    it { is_expected.to have_many(:teams) }
    it { is_expected.to have_many(:memberships) }
    it { is_expected.to have_many(:projects) }

    describe 'validate distinctiveness of projects through memberships' do
      let(:user) { create :user }
      let(:project) { create :project }

      before do
        create :membership, user: user, project: project
      end

      it "doesn't allow the same project in two different memberships" do
        expect do
          create :membership, user: user, project: project
        end.to raise_error(ActiveRecord::RecordNotUnique)
      end
    end
  end

  describe '#remove_story_association' do
    let(:user) { create :user }
    let(:project) { build :project }
    let(:story) { build :story, project: project }

    before do
      project.users << user
      project.save
      story.owned_by = user
      story.requested_by = user
      story.save
    end

    it 'removes the story owner and requester when the user is destroyed' do
      expect { user.destroy }.to change { Membership.count }.by(-1)
      story.reload
      expect(story.owned_by).to be_nil
      expect(story.requested_by).to be_nil
    end
  end

  describe '#to_s' do
    subject do
      build(:user, name: 'Dummy User', initials: 'DU',
                   email: 'dummy@example.com')
    end

    its(:to_s) { should == 'Dummy User (DU) <dummy@example.com>' }
  end

  describe '#as_json' do
    before do
      subject.id = 42
    end

    specify do
      expect(subject.as_json['user'].keys.sort).to eq(
        %w[email finished_tour guest? id initials name tour_steps username]
      )
    end
  end

  describe '#remove_story_association' do
    let(:user) { create :user }
    let(:project) { build :project }
    let(:story) { build :story, project: project }

    before do
      project.users << user
      project.save
      story.owned_by = user
      story.requested_by = user
      story.save
    end

    it 'removes the story owner and requester when the user is destroyed' do
      expect { user.destroy }.to change { Membership.count }.by(-1)
      story.reload
      expect(story.owned_by).to be_nil
      expect(story.requested_by).to be_nil
    end
  end

  describe '#miner?' do
    let(:regular_user) { build :user, email: 'dummy@example.com' }
    let(:codeminer_user) { build :user, email: 'dummy@codeminer42.com' }

    it 'returns true to members with codeminer42 email' do
      expect(codeminer_user.miner?).to be(true)
    end

    it 'returns false to members with regular email' do
      expect(regular_user.miner?).to be(false)
    end
  end
end
