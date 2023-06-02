require 'rails_helper'

describe TeamOperations do
  let(:team_params) { { name: 'Test Team' } }
  let(:team) { Team.new(team_params) }

  describe 'Destroy' do
    before { team.save! }

    subject { -> { TeamOperations::Destroy.call(team, nil) } }

    it { expect(subject.call.archived_at).to_not be_nil }
  end
end
