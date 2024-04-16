require 'rails_helper'

describe StoriesController do
  describe 'when logged out' do
    %w[index create].each do |action|
      specify do
        get action, params: { project_id: 99 }
        expect(response).to redirect_to(new_user_session_url)
      end
    end

    %w[update destroy].each do |action|
      specify do
        get action, params: { project_id: 99, id: 42 }
        expect(response).to redirect_to(new_user_session_url)
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
              project.stories.order(:position).map { |story| story.to_csv({ notes: 1, tasks: 0 }) }
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

      describe '#update' do
        context 'when update succeeds' do
          specify do
            get :update, params: { project_id: project.id, id: story.id, story: story_params }
            expect(response).to redirect_to(project_path(project))
          end
        end

        context 'when update fails' do
          specify do
            get :update, params: { project_id: project.id, id: story.id, story: { title: '' } }
            expect(response).to redirect_to(project_path(project) + "#story-#{story.id}")
          end
        end
      end

      describe '#destroy' do
        specify do
          delete :destroy, params: { project_id: project.id, id: story.id }
          expect(response).to redirect_to(project_path(project))
        end
      end

      describe '#create' do
        context 'when save succeeds' do
          specify do
            post :create, params: { project_id: project.id, story: story_params }
            expect(response).to redirect_to(project_path(project))
          end
        end

        xcontext 'when save fails' do
          specify do
            post :create, params: { project_id: project.id, story: { title: '' } }
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
            post :create, params: { project_id: project.id, story: story_params }
            expect(response).to redirect_to(project_path(project))
          end
        end
      end
    end
  end
end
