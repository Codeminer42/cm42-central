require 'rails_helper'

describe StoryOperations::ReadAll do
  let(:user)         { create(:user, :with_team) }
  let(:current_team) { user.teams.first }
  let(:done_story)   { create(:story, :done, project: project, requested_by: user) }
  let(:active_story) { create(:story, :active, project: project, requested_by: user) }

  let!(:past_iteration) do
    iteration_start = project.created_at.to_date
    iteration_end = ((project.created_at + project.iteration_length * 7.days) - 1.day).to_date
    Iterations::PastIteration.new(start_date: iteration_start,
                                  end_date: iteration_end,
                                  stories: [],
                                  points: done_story.estimate)
  end

  subject      { -> { StoryOperations::ReadAll.call(project: project) } }
  let(:result) { subject.call.success }

  context 'when there are stories in the done column' do
    let(:project) { create(:project, :with_past_iteration, users: [user], teams: [current_team]) }
    let(:subject_past_iteration) { result[:past_iterations].first }

    it 'does not return done stories as Story objects' do
      expect(result[:active_stories]).to_not include(done_story)
    end

    it 'returns the stories that are active' do
      expect(result[:active_stories]).to contain_exactly(active_story)
    end

    it 'returns the past iterations with its iteration number, points and dates', :aggregate_failures do
      expect(subject_past_iteration.start_date).to eq(past_iteration.start_date)
      expect(subject_past_iteration.end_date).to eq(past_iteration.end_date)
      expect(subject_past_iteration.points).to eq(past_iteration.points)
      expect(subject_past_iteration.stories).to eq(past_iteration.stories)
      expect(subject_past_iteration.iteration_number).to eq(1)
    end
  end

  context 'when there are no past iterations' do
    let(:project) { create(:project, users: [user], teams: [current_team]) }

    it 'does not return past iterations' do
      expect(result[:past_iterations]).to be_empty
    end

    it 'returns the stories that are active' do
      expect(result[:active_stories]).to contain_exactly(active_story)
    end
  end

  context 'when there are no active stories' do
    let(:project) { create(:project, :with_past_iteration, users: [user], teams: [current_team]) }
    let(:active_story) { done_story }
    let(:subject_past_iteration) { result[:past_iterations].first }

    it 'does not return active stories' do
      expect(result[:active_stories]).to be_empty
    end

    it 'returns the past iterations with its iteration number, points and dates', :aggregate_failures do
      expect(subject_past_iteration.start_date).to eq(past_iteration.start_date)
      expect(subject_past_iteration.end_date).to eq(past_iteration.end_date)
      expect(subject_past_iteration.points).to eq(past_iteration.points)
      expect(subject_past_iteration.stories).to eq(past_iteration.stories)
      expect(subject_past_iteration.iteration_number).to eq(1)
    end
  end

  context 'when the project started a month ago' do
    let(:project) { create(:project, :created_one_month_ago, users: [user], teams: [current_team]) }
    let(:iteration_length)         { project.iteration_length * 7 }
    let(:days_since_project_start) { (Date.current - project.start_date).to_i }
    let(:number_of_iterations)     { days_since_project_start / iteration_length }

    it 'returns the correct amount of past iterations' do
      expect(result[:past_iterations].length).to eq(number_of_iterations)
    end

    it 'returns the right iteration number for each past iteration' do
      expect(result[:past_iterations].map(&:iteration_number)).to eq([1, 2, 3, 4])
    end
  end
end
