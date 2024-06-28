require 'rails_helper'

describe TeamOperations::Create do
  describe '#call' do
    subject { -> { TeamOperations::Create.call(team: team, current_user: user) }}

    let(:team) { build(:team, team_params) }
    let(:user) { create(:user) }

    context 'with valid team' do
      let(:team_params) { { name: 'Team' } }

      it 'saves team' do
        expect { subject.call }.to change { Team.count }.by(1)
      end

      it 'creates enrollment' do
        expect { subject.call }.to change { Enrollment.count }.by(1)
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end

      it 'returns created team' do
        expect(subject.call.success).to eq(Team.last)
      end

      context 'when user is nil' do
        let(:user) { nil }

        it 'saves team' do
          expect { subject.call }.to change { Team.count }.by(1)
        end

        it 'does not create enrollment' do
          expect { subject.call }.to_not change { Enrollment.count }
        end

        it 'returns success' do
          expect(subject.call.success?).to be(true)
        end

        it 'returns created team' do
          expect(subject.call.success).to eq(Team.last)
        end
      end
    end

    context 'with invalid team' do
      let(:team_params) { { name: '' } }

      it 'does not save team' do
        expect { subject.call }.to_not change { Team.count }
      end

      it 'does not create enrollment' do
        expect { subject.call }.to_not change { Enrollment.count }
      end

      it 'returns failure' do
        expect(subject.call.failure?).to be(true)
      end

      it 'returns team with errors' do
        expect(subject.call.failure.errors.full_messages).to eq(['Team Name can\'t be blank'])
      end
    end
  end
end
