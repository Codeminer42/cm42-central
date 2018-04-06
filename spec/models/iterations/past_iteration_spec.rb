require 'rails_helper'
module Iterations
  describe PastIteration do
    let(:project) { create(:project, :with_past_date) }
    let(:done_story_params) do
      {
        title: 'Done story',
        state: 'accepted',
        estimate: 8,
        accepted_at: project.created_at,
      }
    end

    before do
      3.times { project.stories.create!(done_story_params) }
    end
    
    subject { PastIteration.new(start_date: project.created_at, end_date: project.created_at + 7, project: project) }

    describe '#points' do
      it 'sums the estimate of the stories in this iteration' do
        expect(subject.points).to eq(done_story_params[:estimate] * 3)
      end
    end
  end
end
