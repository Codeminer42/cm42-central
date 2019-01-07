require 'rails_helper'

describe GitlabApi::CreateHook do
  describe '#perform', :vcr do
    let(:gitlab_api_url) { 'https://gitlab.com/api/v4' }
    let(:gitlab_project_id) { 406 }
    let(:params) {
      {
        "id" => gitlab_project_id,
        "url" => 'http://yourdomain.com/gitlab/projects/events',
        "merge_request_events" => true
      }
    }

    context 'with proper params' do
      let(:gitlab_private_token) { 'correcttoken' }

      subject do
        described_class.new(
          gitlab_api_url,
          gitlab_private_token,
          gitlab_project_id,
          params
        ).perform
      end

      it { is_expected.to be_success }
    end

    context 'with improper params' do
      let(:gitlab_private_token) { 'incorrecttoken' }

      subject do
        described_class.new(
          gitlab_api_url,
          gitlab_private_token,
          gitlab_project_id,
          params
        ).perform
      end

      it { is_expected.not_to be_success }
    end
  end
end
