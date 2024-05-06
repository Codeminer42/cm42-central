require 'rails_helper'

describe NotesController do
  let!(:project) { create(:project, name: 'Test Project', users: [user]) }
  let(:user)    { create :user, email: 'user@example.com', password: 'password' }
  let(:story)   { create(:story, project: project, requested_by: user) }
  let(:request_params) { { project_id: project.id, story_id: story.id } }

  context 'when not logged in' do
    describe 'member actions' do
      before do
        note = create(:note, story: story)
        request_params[:id] = note.id
      end

      specify '#destroy' do
        delete :destroy, xhr: true, params: request_params
        expect(response.status).to eq(401)
      end
    end
  end

  context 'when logged in' do
    before do
      sign_in user
      allow(subject).to receive_messages(current_user: user, current_project: user.projects.first)
    end

    describe 'member actions' do
      let(:note) { create(:note, story: story) }
      let(:request_params) do
        { id: note.id, project_id: project.id, story_id: story.id }
      end

      describe '#destroy' do
        specify do
          delete :destroy, params: request_params
          expect(response).to redirect_to(project_path(project))
        end
      end
    end
  end
end
