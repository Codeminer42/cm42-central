require 'rails_helper'

describe DiscordMessage do
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
            color: 0x36a64f,
            title: 'Central',
            url: 'http://foo.com/projects/123#story-2',
            description: "The story 'Sample' has been started.",
            fields: [
              { name: 'Assigned to', value: 'Mike', inline: true },
              { name: 'Points', value: '1', inline: true }
            ]
          }
        ]
      )
    end
  end
end
