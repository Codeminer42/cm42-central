require 'rails_helper'

describe TeamOperations::Update do
  describe '#call' do
    subject { -> { TeamOperations::Update.call(team: team, team_attrs: team_params, current_user: user) }}

    let(:team) { create(:team) }
    let(:user) { nil }

    context 'with valid team' do
      let(:team_params) do
        { name: 'Team Update'}
      end

      it 'updates team' do
        expect(subject.call.success.name).to eq(team_params[:name])
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end
    end

    context 'with invalid team' do
      let(:team_params) do
        { name: ''}
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
