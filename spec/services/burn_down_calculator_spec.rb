require 'rails_helper'

describe BurnDownCalculator do
  let(:service_full)  { double(:service_full, backlog_iterations: [backlog_iteration]) }
  let(:project)       { double(:project, name: 'Central') }
  let(:story1)        { double(:story1, estimate: 3, delivered_at: yesterday) }
  let(:story2)        { double(:story2, estimate: 8, delivered_at: today) }
  let(:stories)       { [story1, story2] }

  let(:backlog_iteration)  do
    double(:backlog_iteration, points: 11, to_a: stories, start_date: tomorrow)
  end

  let(:yesterday) { Date.current - 1.day }
  let(:today)     { Date.current }
  let(:tomorrow)  { Date.current + 1.day }

  let(:group_by_day) do
    {
      yesterday => 0,
      today     => 1,
      tomorrow  => 1
    }
  end

  subject { described_class.call(project) }

  before do
    allow(IterationService).to receive(:new).with(project, since: nil).and_return(service_full)
    allow(service_full).to receive(:start_date).and_return(yesterday)
  end

  describe '#call' do
    it 'returns classified points' do
      expect(subject).to eq(
        [
          {
            name: 'today',
            data: { today => 8 }
          },
          {
            name: 'real',
            data: { yesterday => 8, today => 0, tomorrow => 0 }
          },
          {
            name: 'ideal',
            data: { yesterday => 11, today => 5.5, tomorrow => 0.0 }
          }
        ]
      )
    end
  end
end
