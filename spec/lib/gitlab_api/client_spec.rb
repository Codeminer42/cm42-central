require 'rails_helper'

describe GitlabApi::Client do
  let(:gitlab_api_url) { 'https://gitlab.com/api/v4' }
  let(:gitlab_private_token) { 'asdfasdf' }
  let(:api) { described_class.new(gitlab_api_url, gitlab_private_token, 200) }

  describe '#connection' do
    subject { api.connection }

    it 'creates a connection with proper params' do
      is_expected.to have_attributes(
        headers: hash_including(
          'Content-Type' => 'application/json',
          'Accept' => 'application/json',
          'Private-Token' => gitlab_private_token
        ),
        url_prefix: have_attributes(to_s: gitlab_api_url)
      )
    end
  end

  describe '#get' do
    let(:connection) { instance_double 'connection' }
    let(:path) { 'projects' }
    let(:response) { 'response' }

    subject(:get_request) { api.get(path) }

    before do
      allow(api).to receive(:connection).and_return(connection)
      allow(connection).to receive(:get).with(path).and_return(response)
    end

    it 'sets the response' do
      get_request
      expect(api.response).to eq(response)
    end

    it 'returns self' do
      is_expected.to eq(api)
    end
  end

  describe '#data' do
    let(:data) { { 'name' => 'asdf', 'id' => 1 } }
    let(:response) { double(:response, body: data.to_json) }

    before do
      allow(api).to receive(:response).and_return(response)
    end

    subject { api.data }

    it { is_expected.to eq(data) }
  end

  describe '#success?' do
    before do
      stub_const("#{api.class}::SUCCESS_RESPONSE_CODE", 200)
      allow(api).to receive(:response).and_return(response)
    end

    subject { api.success? }

    context 'when it succeeds' do
      let(:response) { double(:response, status: 200) }
      it { is_expected.to be_truthy }
    end

    context 'when it fails' do
      let(:response) { double(:response, status: 401) }
      it { is_expected.to be_falsey }
    end
  end

  describe '#error_message' do
    subject { api.error_message }

    before do
      allow(api).to receive(:data).and_return(data)
      allow(api).to receive(:success?).and_return(response)
    end

    context 'when it failed' do
      let(:response) { false }

      context 'when it returns message' do
        let(:data) { { 'message' => '401 Unauthorized' } }

        it { is_expected.to eq(data['message']) }
      end

      context 'when it returns error' do
        let(:data) { { 'error' => '404 Not Found' } }

        it { is_expected.to eq(data['error']) }
      end
    end

    context 'when it succeeded' do
      let(:response) { true }
      let(:data) { { 'message' => 'it succeeded' } }

      it { is_expected.to be_nil }
    end

  end
end
