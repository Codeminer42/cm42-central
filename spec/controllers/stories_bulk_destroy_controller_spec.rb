require 'rails_helper'

describe StoriesBulkDestroyController do
  describe '#create' do
    before(:each) do
      sign_in user
    end

    def response_json(status)
      JSON.parse(response.body)[status]
    end

    let(:user) { create(:user, :with_team) }
    let(:project) { create(:project, users: [user], teams: [user.teams.first]) }
    let(:story_1) { create(:story, project: project, requested_by: user) }
    let(:story_2) { create(:story, project: project, requested_by: user) }
    let(:story_3) { create(:story, project: project, requested_by: user) }

    context 'when receive an array of story ids' do
      before(:each) do
        post :create, project_id: project.id, story_ids: [story_1.id, story_2.id]
      end

      it 'destroys stories' do
        expect(project.stories).to eq([story_3])
      end

      it 'responds with 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns a successfully message' do
        expect(response_json('message')).to eql('Stories were successfully destroyed.')
      end
    end

    context 'when bulk destroy fails' do
      before(:each) do
        allow(StoryOperations::DestroyAll).to receive(:call).and_return(false)
        post :create, project_id: project.id, story_ids: [story_1.id, story_2.id]
      end

      it 'responds with 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns an error message' do
        expect(response_json('errors')).to eql('Stories were not successfully destroyed.')
      end
    end
  end
end
