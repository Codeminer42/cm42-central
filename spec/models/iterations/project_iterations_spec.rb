require 'rails_helper'

module Iterations
  describe ProjectIterations do
    subject { described_class.new(project: project) }

    describe '#current_iteration_start' do
      let(:project) { create(:project) }

      it 'returns the current iteration start date' do
        expect(subject.current_iteration_start.wday).to eq(project.iteration_start_day)
      end
    end

    describe '#past_iterations' do
      let(:project) { create(:project, :with_past_iteration) }

      it 'returns a past iteration' do
        expect(subject.past_iterations).to all(be_a(PastIteration))
      end

      context "when project didn't start in the same week day as the iterations" do
        let(:story) { create(:story, :done, :with_project) }
        let(:project) { story.project }

        it 'all past iterations must start in the iteration_start_day' do
          interation_start_day = 0
          project.iteration_start_day = interation_start_day
          project.start_date += interation_start_day + 1
          project.start_date -= 3.weeks

          past_iterations_start_date = subject.past_iterations.map{ |iteration| iteration.start_date.wday }

          expect(past_iterations_start_date).to all(be project.iteration_start_day)
        end

        it 'considers the length of the first iteration to calculate the second iteration stories' do
          project.start_date -= 21.days
          story.accepted_at -= 17.days

          second_iteration = subject.past_iterations[1]
          expect(second_iteration.stories).to include(story)
        end
      end
    end
  end
end
