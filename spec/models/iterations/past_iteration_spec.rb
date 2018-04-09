require 'rails_helper'

module Iterations
  describe PastIteration do
    let(:project) { create(:project, :with_past_date) }
    let(:done_story_params) do
      {
        title: 'Done story',
        state: 'accepted',
        estimate: 8,
        accepted_at: project.created_at
      }
    end

    let(:past_iteration_params) do
      { start_date: project.created_at, end_date: project.created_at + 7, project: project }
    end

    subject { described_class.new(past_iteration_params) }

    before do
      3.times { project.stories.create!(done_story_params) }
    end

    describe '#points' do
      it 'sums the story estimates in this iteration' do
        expect(subject.points).to eq(done_story_params[:estimate] * 3)
      end
    end
  end
end
