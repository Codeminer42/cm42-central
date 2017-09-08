require 'rails_helper'

describe BurnUpCalculator do
  let(:service_full)  { double(:service_full) }
  let(:project)       { double(:project, name: 'Central') }
  let(:story1)        { double(:story1, estimate: 3) }
  let(:story2)        { double(:story2, estimate: 8) }
  let(:stories)       { [story1, story2] }

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
    allow(service_full).to receive(:instance_variable_get).with('@stories').and_return(stories)
    allow(service_full).to receive(:group_by_day).and_return(group_by_day)
  end

  describe '#call' do
    it 'returns classified points' do
      expect(subject).to eq(
        [
          {
            name: 'today',
            data: { today => 1 }
          },
          {
            name: 'real',
            data: { yesterday => 0, today => 1, tomorrow => 1 }
          },
          {
            name: 'ideal',
            data: { yesterday => 0, today => 3.6666666666666665, tomorrow => 7.333333333333333 }
          }
        ]
      )
    end
  end
end
