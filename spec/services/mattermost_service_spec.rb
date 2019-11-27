require 'rails_helper'

describe Integrations::Mattermost::Service do
  let(:mattermost) { described_class.new('http://foo.com', 'test-channel', 'bot')}

  context '#payload' do
    it 'returns a JSON formatted payload' do
      expect(mattermost.payload('Hello World')).to eq("{\"username\":\"bot\",\"channel\":\"test-channel\",\"text\":\"Hello World\"}")
    end
  end

  context '#send' do
    it 'triggers a HTTP POST to send payload' do
      expect(Rails.env).to receive(:development?).and_return(false)
      expect(Net::HTTP).to receive(:post_form)
      mattermost.send('hello')
    end
  end
end
