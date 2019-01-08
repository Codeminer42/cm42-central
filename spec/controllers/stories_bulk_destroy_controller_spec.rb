require 'rails_helper'

describe StoriesBulkDestroyController do
  describe '#create' do
    before do
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
      before do
        post :create, params: { project_id: project.id, story_ids: [story_1.id, story_2.id] }
      end

      it 'destroys stories' do
        expect(project.stories).to contain_exactly(story_3)
      end

      it 'responds with 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns a successfully message' do
        successfully_message = "Stories were successfully destroyed"

        expect(response_json('message')).to eql(successfully_message)
      end
    end

    context 'when bulk destroy fails' do
      before do
        allow(StoryOperations::DestroyAll).to receive(:call).and_return(false)
        post :create, params: { project_id: project.id, story_ids: [story_1.id, story_2.id] }
      end

      it 'responds with 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns an error message' do
        error_message = "Stories couldn't be destroyed due some validation errors"

        expect(response_json('errors')).to eql(error_message)
      end
    end
  end
end
