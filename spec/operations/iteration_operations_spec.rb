require 'rails_helper'

describe IterationOperations do
  describe '::Read' do
    let(:project) do
      create(:project, :with_past_iteration, users: [user], teams: [user.teams.first])
    end
    let(:user)       { create(:user, :with_team) }
    let(:stories)    { create_list(:story, 3, :done, project: project, requested_by: user) }
    let(:start_date) { project.created_at.to_date }
    let(:end_date)   { ((project.created_at + project.iteration_length * 7.days) - 1.day).to_date }

    subject      { IterationOperations::Read }
    let(:result) { subject.call(start_date: start_date, end_date: end_date, project: project) }

    describe '.call' do
      it 'returns done stories' do
        expect(result[:stories]).to eq(stories)
      end
    end
  end
end
