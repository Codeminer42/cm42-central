require 'rails_helper'

describe SlackMessage do
  let(:project) { double(:project, name: 'Central') }

  let(:model) do
    double(
      :model,
      project: project,
      base_uri: 'http://foo.com/projects/123',
      id: 2,
      title: 'Sample',
      state: 'started',
      owned_by_name: 'Mike',
      estimate: 1
    )
  end

  subject { described_class.new(model) }

  describe '#message' do
    it 'returns message' do
      expect(subject.message).to eq(
        [
          {
            fallback: "The story 'Sample' has been started.",
            color: '#36a64f',
            title: 'Central',
            title_link: 'http://foo.com/projects/123#story-2',
            text: "The story 'Sample' has been started.",
            fields: [
              { title: 'Assigned to', value: 'Mike', short: true },
              { title: 'Points', value: '1', short: true }
            ]
          }
        ]
      )
    end
  end
end
