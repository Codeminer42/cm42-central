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

  context 'create stories to the project' do
    before do
      headers = { 'x-api-key': ENV['EXPORT_API_TOKEN'] }
      request.headers.merge headers
    end

    subject { post :create, params: post_params }

    it 'should create two new stories' do
      expect(subject).to have_http_status :created
    end

    context 'should deny when the title is missing' do
      let(:post_params) do
        {
          project_id: project.slug,
          stories: [{}]
        }
      end

      subject { post :create, params: post_params }

      it 'should create two new stories' do
        expect{ subject }.to raise_error ActionController::ParameterMissing
      end
    end
  end

  context 'deny whem headers is missing' do
    subject { post :create, params: post_params }

    it 'should not create any story' do
      expect(subject).to have_http_status :unauthorized
    end
  end
end
