require 'rails_helper'

describe Integrations::Slack::Service do
  let(:slack) { described_class.new('http://foo.com', 'test-channel', 'bot') }

  context '#payload' do
    it 'returns a JSON formatted payload' do
      expect(slack.payload('Hello World')).to eq("{\"username\":\"bot\",\"channel\":\"test-channel\",\"attachments\":\"Hello World\"}")
    end
  end

  context '#send' do
    it 'triggers a HTTP POST to send payload' do
      expect(Rails.env).to receive(:development?).and_return(false)
      expect(Net::HTTP).to receive(:post_form)
      slack.send('hello')
    end
  end
end
