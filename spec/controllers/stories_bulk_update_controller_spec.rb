require 'rails_helper'

describe StoriesBulkUpdateController do
  describe '#create' do
    def catch_column(model, arg)
      model.map do |record|
        record.reload[arg.to_sym]
      end
    end

    def response_body(status)
      JSON.parse(response.body)[status]
    end

    before do
      sign_in user_1
    end

    let(:user_1) { create(:user, :with_team) }
    let(:user_2) { create(:user, :with_team) }
    let(:user_3) { create(:user, :with_team) }
    let(:user_4) { create(:user, :with_team) }
    let(:project) { create(:project, users: [user_1, user_2, user_3], teams: [user_1.teams.first]) }
    let(:model) { create_list(:story, 2, project: project, requested_by: user_1) }

    let(:params) do
      {
        project_id: project.id, story_ids: model.map(&:id), requested_by_id: user_2.id,
        owned_by_id: user_3.id, labels: 'back, front'
      }
    end

    context 'when receive an array of story ids' do
      context 'when set valid attributes' do
        before do
          post :create, params
        end

        it 'updates the story requester' do
          expect(catch_column(model, 'requested_by_id')).to all(eq(user_2.id))
        end

        it 'updates the story owner' do
          expect(catch_column(model, 'owned_by_id')).to all(eq(user_3.id))
        end

        it 'updates the story labels' do
          expect(catch_column(model, 'labels')).to all(eq('back, front'))
        end

        it 'responds with 200' do
          expect(response.status).to eq(200)
        end

        it 'returns a successfully message' do
          expect(response_body('message')).to eq('Stories were successfully updated')
        end
      end

      context 'when set invalid owner' do
        before do
          post :create, params.merge(owned_by_id: user_4)
        end

        it 'responds with 422' do
          expect(response.status).to eq(422)
        end

        it 'returns an error message' do
          error_message = { 'owned_by_id' => ['user is not a member of this project'] }

          expect(response_body('error')).to all(eq(error_message))
        end
      end

      context 'when stories are not found' do
        before do
          post :create, params.merge(story_ids: nil)
        end

        it 'returns a message' do
          expect(response_body('message')).to eq('Stories not found')
        end

        it 'responds with 404' do
          expect(response.status).to eq(404)
        end
      end
    end
  end
end
