require 'rails_helper'

module Iterations
  describe ProjectIterations do
    subject { described_class.new(project: project) }
    let(:first_iteration) { subject.past_iterations[0] }
    let(:second_iteration) { subject.past_iterations[1] }

    describe '#current_iteration_start' do
      let(:project) { create(:project) }

      it 'returns the current iteration start date' do
        expect(subject.current_iteration_start.wday).to eq(project.iteration_start_day)
      end
    end

    describe '#past_iterations' do
      let(:project) { create(:project, :with_past_iteration) }

      shared_examples 'accepted story' do |day_of_iteration|
        it "in the #{day_of_iteration}" do
          story.accepted_at = accepted_date
          story.save!

          expect(iteration.stories).to include(story)
        end
      end

      it 'returns a past iteration' do
        expect(subject.past_iterations).to all(be_a(PastIteration))
      end

      context 'when project start in the same week day as the iterations' do
        let(:story) { create(:story, :done, :with_project) }
        let(:project) { story.project }

        context 'project starts in monday and iteration in monday' do
          let(:first_iteration_start_day) { Date.new(2018, 10, 1) }
          let(:first_iteration_last_day) { Date.new(2018, 10, 7) }

          before do
            project.start_date = Date.new(2018, 10, 1) # monday wday = 1
            project.iteration_start_day = 1 # monday wday = 1
          end

          it 'first iteration should start in a monday' do
            monday = 1
            expect(first_iteration.start_date.wday).to eq(monday)
          end

          context 'when a story is accepted' do
            include_examples 'accepted story', 'first day of first iteration' do
              let(:accepted_date) { first_iteration_start_day }
              let(:iteration) { first_iteration }
            end

            include_examples 'accepted story', 'last day of first iteration' do
              let(:accepted_date) { first_iteration_last_day }
              let(:iteration) { first_iteration }
            end

            include_examples 'accepted story', 'first day of second iteration' do
              let(:accepted_date) { first_iteration_last_day + 1.day }
              let(:iteration) { second_iteration }
            end
          end
        end
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

          expect(second_iteration.stories).to include(story)
        end

        context 'when story is accepted in the last day of iteration' do
          before do
            story.accepted_at = Time.current.days_ago(10)
            story.save!
          end

          it 'should be in the first iteration' do
            expect(first_iteration.stories).to include(story)
          end

          it "shouldn't be in the first iteration" do
            expect(second_iteration.stories).not_to include(story)
          end
        end

        context 'when iteration start day must be in a week before project start' do
          context 'project starts in monday and iteration in saturday' do
            let(:first_iteration_start_day) { Date.new(2018, 9, 29) }
            let(:first_iteration_last_day) { Date.new(2018, 10, 5) }

            before do
              project.start_date = Date.new(2018, 10, 1) # monday wday = 1
              project.iteration_start_day = 6 # saturday wday = 6
            end

            it 'first iteration should start in a saturday' do
              saturday = 6
              expect(first_iteration.start_date.wday).to eq(saturday)
            end

            context 'when a story is accepted' do
              include_examples 'accepted story', 'project start date' do
                let(:accepted_date) { project.start_date }
                let(:iteration) { first_iteration }
              end

              include_examples 'accepted story', 'first day of first iteration' do
                let(:accepted_date) { first_iteration_start_day }
                let(:iteration) { first_iteration }
              end

              include_examples 'accepted story', 'last day of first iteration' do
                let(:accepted_date) { first_iteration_last_day }
                let(:iteration) { first_iteration }
              end

              include_examples 'accepted story', 'first day of second iteration' do
                let(:accepted_date) { first_iteration_last_day + 1.day }
                let(:iteration) { second_iteration }
              end
            end
          end
        end

        context 'when iteration start day is in the same week of project start' do
          context 'project starts in wednesday and iteration in monday' do
            before do
              project.start_date = Date.new(2018, 9, 26) # wednesday wday = 3
              project.iteration_start_day = 1 # monday wday = 1
            end

            it 'first iteration should start in a monday' do
              monday = 1
              expect(first_iteration.start_date.wday).to eq(monday)
            end

            context 'when a story is accepted' do
              let(:first_iteration_start_day) { Date.new(2018, 9, 24) }
              let(:first_iteration_last_day) { Date.new(2018, 9, 30) }

              include_examples 'accepted story', 'project start date' do
                let(:accepted_date) { project.start_date }
                let(:iteration) { first_iteration }
              end

              include_examples 'accepted story', 'first day of first iteration' do
                let(:accepted_date) { first_iteration_start_day }
                let(:iteration) { first_iteration }
              end

              include_examples 'accepted story', 'last day of first iteration' do
                let(:accepted_date) { first_iteration_last_day }
                let(:iteration) { first_iteration }
              end

              include_examples 'accepted story', 'first day of second iteration' do
                let(:accepted_date) { first_iteration_last_day + 1.day }
                let(:iteration) { second_iteration }
              end
            end
          end
        end
      end
    end
  end
end
