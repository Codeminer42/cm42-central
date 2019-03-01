require 'rails_helper'

describe Team, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:api_tokens) }
    it { is_expected.to have_many(:tag_groups) }
  end

  describe 'scopes' do
    describe '.ordered_by_name' do
      let!(:first_team) { create(:team, name: 'Team 2') }
      let!(:second_team) { create(:team, name: 'Team 1') }

      subject { described_class.ordered_by_name }

      it { expect(subject.first).to eq(second_team) }
      it { expect(subject.second).to eq(first_team) }
    end
  end

  context 'friendly_id' do
    it 'should create a slug' do
      team = create(:team, name: 'Test Team')
      expect(team.slug).to eq('test-team')
    end

    it 'should return a message error when a slug is reserved word' do
      team = build(:team, name: 'new')
      expect(team.save).to be_falsey
      expect(team.errors.messages).to include(friendly_id: ['is reserved'])
    end
  end
end
