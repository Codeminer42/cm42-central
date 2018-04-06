require 'rails_helper'
module Iterations
  describe ProjectIterations do

    describe '#current_iteration_start' do
      let(:project) { create(:project) } 
      subject { ProjectIterations.new(project: project) }

      it 'returns the start date of the current iteration' do
        expect(subject.current_iteration_start).to eq(DateTime.current.to_date)
      end
    end

    describe '#past_iterations' do
      let(:project_with_past_date) { create(:project, :with_past_date) }
      subject { ProjectIterations.new(project: project_with_past_date) }

      it 'returns a past iteration' do
        expect(subject.past_iterations).to all(be_a(PastIteration))
      end
    end
  end
end
