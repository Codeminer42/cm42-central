require 'rails_helper'

describe StoriesController do
  describe 'when logged out' do
    %w[index done backlog in_progress create].each do |action|
      specify do
        get action, params: { project_id: 99 }
        expect(response).to redirect_to(new_user_session_url)
      end
    end

    %w[show update destroy].each do |action|
      specify do
        get action, params: { project_id: 99, id: 42 }
        expect(response).to redirect_to(new_user_session_url)
      end
    end
  end

  describe '#sort' do
    let(:user) { create :user, :with_team }
    let!(:story1) { create :story, project: project, requested_by: user }
    let!(:story2) { create :story, project: project, requested_by: user }
    let(:project) do
      create(:project, name: 'Test Project', users: [user], teams: [user.teams.first])
    end

    context 'when user has permissions' do
      before do
        sign_in user
        put :sort, xhr: true, params: { project_id: project.id, ordered_ids: [story2.id, story1.id] }
      end

      it 'orders stories in the requested order' do
        expect(response).to have_http_status :ok
        expect(story2.reload.position).to eq(1)
        expect(story1.reload.position).to eq(2)
      end
    end

    context 'when user does not have permissions' do
      let(:unauthorized_user) { create :user }

      before do
        sign_in unauthorized_user
        put :sort, xhr: true, params: { project_id: project.id, ordered_ids: [story2.id, story1.id] }
      end

      it 'is unauthorized' do
        expect(response).to have_http_status :found
        expect(story2.reload.position).to eq(2)
        expect(story1.reload.position).to eq(1)
      end
    end

    context 'when one story does not belong to the project' do
      let!(:story3) { create :story, :with_project, requested_by: user }

      before do
        sign_in user
        put :sort, xhr: true, params: { project_id: project.id, ordered_ids: [story2.id, story1.id, story3.id] }
      end

      it ' is unauthorized' do
        expect(response).to have_http_status :found
        expect(story2.reload.position).to eq(2)
        expect(story1.reload.position).to eq(1)
      end
    end
  end

  context 'when logged in' do
    let(:user) { create :user, :with_team }
    let!(:project) do
      create(:project, name: 'Test Project', users: [user], teams: [user.teams.first])
    end

    before do
      create_list(:story, 3, :done, project: project, requested_by: user)

      sign_in user
    end

    describe '#index' do
      context 'when responding to json' do
        before { get :index, xhr: true, params: { project_id: project.id } }

        it 'responds success' do
          expect(response).to be_successful
        end

        it 'responds correct payload' do
          expect(response.body).to eq(project.stories.to_json)
        end
      end

      context 'when responding to csv' do
        let(:active_story) { create(:story, :active, project: project, requested_by: user) }

        before do
          create(:note, story: active_story)

          Timecop.freeze(2019, 1, 1, 12, 0, 0, 0) do
            get :index, format: :csv, params: { project_id: project.id }
          end
        end

        it 'responds correct Content-Type' do
          expect(response.headers['Content-Type']).to eq 'text/csv'
        end

        it 'responds correct filename' do
          expect(response.headers['Content-Disposition']).to include("attachment; filename=\"Test Project-20190101_1200.csv\"")
        end

        it 'responds correct content' do
          expect(response.body).to eq(
            [
              (Story.csv_headers << 'Note').to_csv,
              project.stories.map { |story| story.to_csv({ notes: 1, tasks: 0 }) }
                             .map(&:to_csv)
            ].flatten.join
          )
        end
      end
    end

    context 'member actions' do
      let(:story) { create(:story, project: project, requested_by: user) }
      let(:story_params) { { title: 'Foo', foo: 'Bar' } }

      let(:tasks_attributes) do
        {
          tasks_attributes: [{
            name: 'Write the tests',
            done: true
          }]
        }
      end

      let(:notes_attributes) do
        {
          notes_attributes: [
            { note: 'A little note hihi' },
            { note: 'Another note' }
          ]
        }
      end

      describe '#show' do
        specify do
          get :show, xhr: true, params: { project_id: project.id, id: story.id }
          expect(response).to be_successful
          expect(response.body).to eq(story.to_json)
        end
      end

      describe '#update' do
        context 'when update succeeds' do
          specify do
            get :update, xhr: true, params: { project_id: project.id, id: story.id, story: story_params }
            expect(response).to be_successful
            expect(response.body).to eq(assigns[:story].to_json)
          end

          context 'including tasks and notes attributes' do
            before do
              patch(
                :update,
                xhr: true,
                params: {
                  project_id: project.id,
                  id: story.id,
                  story: story_params.merge(tasks_attributes, notes_attributes)
                }
              )
            end

            it 'returns the story and the task' do
              expect(response.body).to match(
                tasks_attributes[:tasks_attributes][0][:name]
              )
            end

            it 'returns the story and the notes' do
              expect(response.body).to match(
                notes_attributes[:notes_attributes][0][:note]
              )
              expect(response.body).to match(
                notes_attributes[:notes_attributes][1][:note]
              )
            end
          end
        end

        context 'when update fails' do
          specify do
            get :update, xhr: true, params: { project_id: project.id, id: story.id, story: { title: '' } }
            expect(response.status).to eq(422)
            expect(response.body).to eq(assigns[:story].to_json)
          end
        end
      end

      describe '#destroy' do
        specify do
          delete :destroy, xhr: true, params: { project_id: project.id, id: story.id }
          expect(response).to be_successful
        end
      end

      %w[done backlog in_progress].each do |action|
        describe action do
          specify do
            get action, xhr: true, params: { project_id: project.id, id: story.id }
            expect(response).to be_successful
            expect(response.body).to eq(assigns[:stories].to_json)
          end
        end
      end

      describe '#create' do
        context 'when save succeeds' do
          specify do
            post :create, xhr: true, params: { project_id: project.id, story: story_params }
            expect(response).to be_successful
            expect(response.body).to eq(assigns[:story].to_json)
          end

          context 'including tasks and notes attributes' do
            let(:post_request) do
              post(
                :create,
                xhr: true,
                params: {
                  project_id: project.id,
                  story: story_params.merge(tasks_attributes, notes_attributes)
                }
              )
            end

            it 'creates the story and the task' do
              expect { post_request }.to change { Task.count }.by(1)
            end

            it 'creates the story and the notes' do
              expect { post_request }.to change { Note.count }.by(2)
            end
          end
        end

        context 'when save fails' do
          specify do
            post :create, xhr: true, params: { project_id: project.id, story: { title: '' } }
            expect(response.status).to eq(422)
            expect(response.body).to eq(assigns[:story].to_json)
          end
        end

        describe 'when the user create a story from the another team session', :aggregate_failures do
          let(:user) { create :user, :with_team }
          let(:team) { create :team }
          let(:project) { create :project, users: [user], teams: [user.teams.first] }

          before do
            team.projects << project
            user.teams << [team]
            session[:current_team_slug] = team.slug
          end

          it 'create the story' do
            post :create, xhr: true, params: { project_id: project.id, story: story_params }

            expect(response).to be_successful
            expect(response.body).to eq(assigns[:story].to_json)
          end
        end
      end
    end
  end
end
