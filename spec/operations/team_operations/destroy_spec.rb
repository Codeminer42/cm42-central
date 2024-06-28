require 'rails_helper'

describe TeamOperations::Destroy do
  describe '#call' do
    subject { -> { TeamOperations::Destroy.call(team: team, current_user: user) }}

    let(:team) { create(:team) }
    let(:user) { nil }

    it 'does not destroy team' do
      subject.call
      expect(Team.find(team.id)).to_not be_nil
    end

    it 'archives team' do
      expect(subject.call.success.archived_at).to_not be_nil
    end

    it 'returns success' do
      expect(subject.call.success?).to be(true)
    end
  end
end
