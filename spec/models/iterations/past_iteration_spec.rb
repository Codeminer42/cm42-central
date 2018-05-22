require 'rails_helper'

module Iterations
  describe PastIteration do
    let(:user) { create(:user, :with_team) }
    let(:project) do
      create(:project, :with_past_iteration, users: [user], teams: [user.teams.first])
    end

    let(:past_iteration_params) do
      { start_date: project.created_at, end_date: project.created_at + 7.days, project: project }
    end

    subject { described_class.new(past_iteration_params) }

    let!(:stories) { create_list(:story, 3, :done, project: project, requested_by: user) }

    describe '#points' do
      it 'sums the story estimates in this iteration' do
        expect(subject.points).to eq(24)
      end
    end

    describe '#stories' do
      it 'returns the stories in the iteration' do
        expect(subject.stories).to eq(stories)
      end
    end
  end
end
