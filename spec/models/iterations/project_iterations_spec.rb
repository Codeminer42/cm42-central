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

        before do
          project.start_date = Time.current.days_ago(14)
          project.iteration_start_day = Time.current.days_ago(16).wday
          # first iteration goes 16.days_ago -- 10.days_ago
          # second iteration goes 9.days_ago -- 3.days_ago
        end

        it 'all past iterations must start in the iteration_start_day' do
          project.start_date = Time.current.days_ago(14)
          project.iteration_start_day = Time.current.days_ago(16).wday

          past_iterations_start_date = subject.past_iterations.map{ |iteration| iteration.start_date.wday }

          expect(past_iterations_start_date).to all(be project.iteration_start_day)
        end

        it 'considers the length of the first iteration to calculate the second iteration stories' do
          story.accepted_at = Time.current.days_ago(7)
          story.save!

          second_iteration = subject.past_iterations[1]
          expect(second_iteration.stories).to include(story)
        end

        context 'when story is accepted in the last day of iteration' do
          before do
            story.accepted_at = Time.current.days_ago(10)
            story.save!
          end

          it 'should be in the first iteration' do
            first_iteration = subject.past_iterations[0]
            expect(first_iteration.stories).to include(story)
          end

          it "shouldn't be in the first iteration" do
            second_iteration = subject.past_iterations[1]
            expect(second_iteration.stories).not_to include(story)
          end
        end
      end
    end
  end
end
