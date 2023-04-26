require 'rails_helper'
require 'json'

describe StoryOperations do
  let(:story_params) do
    { title: 'Test Story', requested_by: user, state: 'unstarted', accepted_at: nil }
  end

  let!(:membership) { create(:membership) }
  let(:user)        { membership.user }
  let(:project)     { membership.project }
  let(:story)       { project.stories.build(story_params) }

  describe '::ReadAll' do
    def expect_past_iteration_attrs(subject_past_iteration, past_iteration)
      expect(subject_past_iteration.start_date).to eq(past_iteration.start_date)
      expect(subject_past_iteration.end_date).to eq(past_iteration.end_date)
      expect(subject_past_iteration.points).to eq(past_iteration.points)
      expect(subject_past_iteration.stories).to eq(past_iteration.stories)
      expect(subject_past_iteration.iteration_number).to eq(1)
    end

    let(:user)          { create(:user, :with_team) }
    let(:current_team)  { user.teams.first }
    let!(:done_story)   { create(:story, :done, project: project, requested_by: user) }
    let!(:active_story) { create(:story, :active, project: project, requested_by: user) }

    let!(:past_iteration) do
      iteration_start = project.created_at.to_date
      iteration_end = ((project.created_at + project.iteration_length * 7.days) - 1.day).to_date
      Iterations::PastIteration.new(start_date: iteration_start,
                                    end_date: iteration_end,
                                    stories: [],
                                    points: done_story.estimate)
    end

    subject      { StoryOperations::ReadAll.new }
    let(:result) { subject.call(project: project).value! }

    context 'when there are stories in the done column' do
      let(:project) { create(:project, :with_past_iteration, users: [user], teams: [current_team]) }

      it 'does not return done stories as Story objects' do
        expect(result[:active_stories]).to_not include(done_story)
      end

      it 'returns the stories that are active' do
        expect(result[:active_stories]).to contain_exactly(active_story)
      end

      it 'returns the past iterations with its iteration number, points and dates' do
        subject_past_iteration = result[:past_iterations].first

        expect_past_iteration_attrs(subject_past_iteration, past_iteration)
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

      it 'does not return active stories' do
        expect(result[:active_stories]).to be_empty
      end

      it 'returns the past iterations with its iteration number, points and dates' do
        subject_past_iteration = result[:past_iterations].first

        expect_past_iteration_attrs(subject_past_iteration, past_iteration)
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

  describe '::UpdateAll' do
    let(:user_1)    { create(:user, :with_team) }
    let(:user_2)    { create(:user, :with_team) }
    let(:user_3)    { create(:user, :with_team) }
    let(:project_1) { create(:project, users: [user_1, user_2], teams: [user_1.teams.first]) }
    let(:project_2) { create(:project, users: [user_3], teams: [user_3.teams.first]) }
    let(:story_1)   { create(:story, project: project_1, requested_by: user_1) }
    let(:story_2)   { create(:story, project: project_1, requested_by: user_2) }
    let(:story_3)   { create(:story, project: project_2, requested_by: user_3) }

    subject { StoryOperations::UpdateAll.new }

    let(:result) do
      stories = [story_1, story_2, story_3]
      params = { labels: 'backend', requested_by_id: user_2.id, owned_by_id: user_1.id }
      subject.call(stories: stories, data: params, current_user: user_1)
    end

    context 'when the user is not of the same project' do
      it 'does not update any story' do
        expect(result.success?).to be_falsy
      end
    end
  end
end
