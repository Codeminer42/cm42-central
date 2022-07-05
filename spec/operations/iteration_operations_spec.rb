require 'rails_helper'

describe IterationOperations do
  describe '::Read' do
    let(:project) do
      create(:project, :with_past_iteration, users: [user], teams: [user.teams.first])
    end
    let(:user)       { create(:user, :with_team) }
    let(:start_date) { project.created_at.to_date }
    let(:end_date)   { ((project.created_at + project.iteration_length * 7.days) - 1.day).to_date }
    let!(:stories)   { create_list(:story, 3, :done, project: project, requested_by: user) }

    subject      { IterationOperations::Read }
    let(:result) { subject.call(start_date: start_date, end_date: end_date, project: project) }

    describe '.call' do
      it 'returns done stories' do
        expect(result[:stories]).to match_array(stories)
      end

      it 'return story accepted in the end of the day of the last day' do
        story = create(:story, :done, accepted_at: end_date.end_of_day, project: project, requested_by: user)

        expect(result[:stories]).to include(story)
      end

      it 'return story accepted in the beginning of the day in the first day' do
        story = create(:story, :done, accepted_at: start_date.beginning_of_day, project: project, requested_by: user)

        expect(result[:stories]).to include(story)
      end
    end
  end
end
