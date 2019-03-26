require 'rails_helper'

describe GitlabApi::FetchBranches do
  describe '#perform', :vcr do
    let(:gitlab_api_url) { 'https://gitlab.com/api/v4' }
    let(:gitlab_project_id) { 403 }

    context 'with proper params' do
      let(:gitlab_private_token) { 'correcttoken' }

      subject { described_class.new(gitlab_api_url, gitlab_private_token, gitlab_project_id).perform }

      it { is_expected.to be_success }
    end

    context 'with improper params' do
      let(:gitlab_private_token) { 'incorrecttoken' }

      subject { described_class.new(gitlab_api_url, gitlab_private_token, gitlab_project_id).perform }

      it { is_expected.not_to be_success }
    end
  end
end
