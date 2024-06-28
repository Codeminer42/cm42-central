require 'rails_helper'

describe TeamOperations::Unarchive do
  describe '#call' do
    subject { -> { TeamOperations::Unarchive.call(team: team) }}

    let(:team) { create(:team) }

    it 'unarchives team' do
      expect(subject.call.success.archived_at).to be_nil
    end

    it 'returns success' do
      expect(subject.call.success?).to be(true)
    end
  end
end
