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

          expect(iteration.points).to eq(story.estimate)
        end
      end

      it 'returns a past iteration' do
        expect(subject.past_iterations).to all(be_a(PastIteration))
      end

      context 'when iteration has no stories' do
        it 'has_stories flag is false' do

          flags = subject.past_iterations.map{ |iteration| iteration.has_stories }
          expect(flags).to all(eq(false))
        end
      end

      context 'when iteration has stories' do
        let(:story) { create(:story, :done, :with_project) }
        let(:project) { story.project }

        it 'has_stories flag is true' do
          flags = subject.past_iterations.map{ |iteration| iteration.has_stories }
          expect(flags).to all(eq(true))
        end
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
          project.start_date = Time.current.days_ago(40)
          project.iteration_start_day = Time.current.days_ago(42).wday
        end

        it 'all past iterations except the first must start in the iteration_start_day' do
          past_iterations_start_date = subject.past_iterations.map{ |iteration| iteration.start_date.wday }

          expect(past_iterations_start_date[1..-1]).to all(be project.iteration_start_day)
        end

        xcontext 'when story is accepted in the last day of iteration' do
          before do
            project.start_date = Time.current.days_ago(14)
            project.iteration_start_day = Time.current.days_ago(16).wday

            # first iteration goes 14.days_ago -- 10.days_ago
            story.estimate = 2
            story.accepted_at = Time.current.days_ago(10)
            story.save!
          end

          it 'first iteration points must be equal to story estimate' do
            expect(first_iteration.points).to eq(story.estimate)
          end

          it 'second iteration points must be equal to zero' do
            expect(second_iteration.points).to eq(0)
          end
        end

        context 'when iteration start day must be in a week before project start' do
          context 'project starts in monday and iteration in saturday' do
            let(:first_iteration_last_day) { Date.new(2018, 10, 5) }

            before do
              project.start_date = Date.new(2018, 10, 1) # monday wday = 1
              project.iteration_start_day = 6 # saturday wday = 6
            end

            it 'first iteration should start in a monday' do
              weekday = 1
              expect(first_iteration.start_date.wday).to eq(weekday)
            end

            it 'second iteration should start in a saturday' do
              weekday = 6
              expect(second_iteration.start_date.wday).to eq(weekday)
            end

            context 'when a story is accepted' do
              include_examples 'accepted story', 'project start date' do
                let(:accepted_date) { project.start_date }
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

            it 'first iteration should start in a wednesday' do
              weekday = 3
              expect(first_iteration.start_date.wday).to eq(weekday)
            end

            it 'second iteration should start in a monday' do
              weekday = 1
              expect(second_iteration.start_date.wday).to eq(weekday)
            end

            context 'when a story is accepted' do
              let(:first_iteration_last_day) { Date.new(2018, 9, 30) }

              include_examples 'accepted story', 'project start date' do
                let(:accepted_date) { project.start_date }
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

      context 'Iteration points' do
        let!(:user) { create(:user) }

        # Uses nearest monday as base date. This is necessary to avoid false
        # negatives when running the suite on Sundays.
        let(:date) { Time.current.monday }

        let!(:project) do
          create(:project,
                 start_date: date.days_ago(21),
                 users: [user])
        end

        let!(:stories) do
          create_list(:story, 4,
                      accepted_at: date.days_ago(21),
                      state: 'accepted',
                      project: project,
                      estimate: 3,
                      requested_by: user)
        end

        subject { described_class.new(project: project) }
        let(:first_iteration) { subject.past_iterations[0] }
        let(:second_iteration) { subject.past_iterations[1] }

        context 'when four stories are in the first iteration' do
          it 'first iteration should sum 32 points' do
            expect(first_iteration.points).to eq(12)
          end

          it 'second iteration should sum 0 points' do
            expect(second_iteration.points).to eq(0)
          end
        end

        context 'when three stories are in the first iteration' do
          before do
            stories[0].accepted_at += 8.days
            stories[0].save!
          end

          it 'first iteration should sum 24 points' do
            expect(first_iteration.points).to eq(9)
          end

          it 'second iteration should sum 8 points' do
            expect(second_iteration.points).to eq(3)
          end
        end
      end
    end
  end
end
