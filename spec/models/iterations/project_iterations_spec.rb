require 'rails_helper'

module Iterations
  describe ProjectIterations do
    describe '#current_iteration_start' do
      let(:project) { create(:project) }
      subject       { described_class.new(project: project) }

      it 'returns the current iteration start date' do
        expect(subject.current_iteration_start).to eq(DateTime.current.to_date)
      end
    end

    describe '#past_iterations' do
      let(:past_date_project) { create(:project, :with_past_date) }
      subject                 { described_class.new(project: past_date_project) }

      it 'returns a past iteration' do
        expect(subject.past_iterations).to all(be_a(PastIteration))
      end
    end
  end
end
