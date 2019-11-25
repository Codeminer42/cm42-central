require 'rails_helper'

describe Integrations::Discord::Service do
  let(:discord) { described_class.new('http://foo.com', 'bot') }

  context '#payload' do
    it 'returns a params formatted payload when string' do
      expect(discord.payload('Hello World'))
        .to eq(username: 'bot', embeds: [{ description: 'Hello World' }])
    end

    it 'returns a params formatted payload when embed' do
      expect(discord.payload(description: 'test', color: 123))
        .to eq(username: 'bot', embeds: [{ description: 'test', color: 123 }])
    end

    it 'returns a params formatted and truncated payload when string' do
      expect(discord.payload('lorem ipsum dolor', 5))
        .to eq(username: 'bot', embeds: [{ description: 'lo...' }])
    end

    it 'returns a params formatted and truncated payload when embed' do
      expect(discord.payload({ description: 'lorem ipsum dolor', color: 123 }, 10))
        .to eq(username: 'bot', embeds: [{ description: 'lorem i...', color: 123 }])
    end
  end

  context '#send' do
    let(:http) { double :http }

    it 'triggers a HTTP POST to send payload' do
      expect(Rails.env).to receive(:development?).and_return(false)
      expect(Net::HTTP).to receive(:start).and_yield(http)
      expect(http).to receive(:request)

      discord.send('hello')
    end
  end
end
