require 'rails_helper'

RSpec.describe Stories::BulkCreateController, type: :controller do
  let(:project) { create :project }
  let(:story_1) { attributes_for :story, project: project }
  let(:story_2) { attributes_for :story, project: project }
  let(:post_params) do
    {
      project_id: project.slug,
      stories: [story_1, story_2]
    }
  end

  context 'when API token matches' do
    before do
      ENV['X_API_KEY'] = 'token'
      headers = { 'HTTP_X_API_TOKEN': ENV['X_API_KEY'] }
      request.headers.merge headers
    end

    subject { post :create, params: post_params }

    it 'should return created status' do
      expect(subject).to have_http_status :created
    end

    context 'when the title is missing' do
      let(:post_params) do
        {
          project_id: project.slug,
          stories: [{}]
        }
      end

      subject { post :create, params: post_params }

      it 'should deny the creation of the stories' do
        expect{ subject }.to raise_error ActionController::ParameterMissing
      end
    end
  end

  context 'when headers is missing' do
    subject { post :create, params: post_params }

    it 'should return unauthorized status' do
      expect(subject).to have_http_status :unauthorized
    end
  end

  context 'when API token does not matches' do
    before do
      ENV['X_API_KEY'] = nil

      headers = { 'HTTP_X_API_TOKEN': 'token' }
      request.headers.merge headers
    end

    subject { post :create, params: post_params }

    it 'should return unauthorized status' do
      expect(subject).to have_http_status :unauthorized
    end
  end
end
