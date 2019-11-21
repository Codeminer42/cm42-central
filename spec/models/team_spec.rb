require 'rails_helper'

describe Team, type: :model do
  it { is_expected.to validate_presence_of :name }
  it { is_expected.to have_many :enrollments }
  it { is_expected.to have_many :users }
  it { is_expected.to have_many :ownerships }
  it { is_expected.to have_many :projects }
  it { is_expected.to have_many(:api_tokens) }
  it { is_expected.to have_many(:tag_groups) }

  context '#allowed_domain' do
    it 'is in whitelist' do
      subject.registration_domain_whitelist = 'codeminer42.com, uol.com.br'
      expect(subject.allowed_domain?('foo@codeminer42.com')).to be_truthy
      expect(subject.allowed_domain?('foo@uol.com.br')).to be_truthy
      expect(subject.allowed_domain?('foo@yahoo.com.br')).to be_falsey
    end

    it 'is not in blacklist' do
      subject.registration_domain_blacklist = "hotmail.com\ngmail.com\nyahoo.com.br"
      expect(subject.allowed_domain?('foo@codeminer42.com')).to be_truthy
      expect(subject.allowed_domain?('foo@uol.com.br')).to be_truthy
      expect(subject.allowed_domain?('foo@yahoo.com.br')).to be_falsey
    end

    it 'it is both in the whitelist and not in the blacklist' do
      subject.registration_domain_whitelist = 'codeminer42.com, uol.com.br'
      subject.registration_domain_blacklist = "hotmail.com\ngmail.com\nyahoo.com.br"
      expect(subject.allowed_domain?('foo@codeminer42.com')).to be_truthy
      expect(subject.allowed_domain?('foo@uol.com.br')).to be_truthy
      expect(subject.allowed_domain?('foo@yahoo.com.br')).to be_falsey
      expect(subject.allowed_domain?('foo@gmail.com.br')).to be_falsey
    end
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
