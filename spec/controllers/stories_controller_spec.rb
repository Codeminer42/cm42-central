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
          expect(response.headers['Content-Disposition']).to eq "attachment; filename=\"Test Project-20190101_1200.csv\""
        end

        it 'responds correct content' do
          expect(response.body).to eq(
            [
              (Story.csv_headers << 'Note').to_csv,
              project.stories.map { |story| story.to_csv({ notes: 1, documents: 0, tasks: 0 }) }
                             .map(&:to_csv)
            ].flatten.join
          )
        end
      end
    end

    context 'update documents' do
      let(:attachments) do
        [
          {
            'id' => 30,
            'public_id' => 'Screen_Shot_2016-08-19_at_09.30.57_blnr1a',
            'version' => '1471624237',
            'format' => 'png',
            'resource_type' => 'image',
            'path' => 'v1471624237/Screen_Shot_2016-08-19_at_09.30.57_blnr1a.png'
          },
          {
            'id' => 31,
            'public_id' => 'Screen_Shot_2016-08-19_at_09.30.57_blnr1a',
            'version' => '1471624237',
            'format' => 'png',
            'resource_type' => 'image',
            'path' => 'v1471624237/Screen_Shot_2016-08-19_at_09.30.57_blnr1a.png'
          }
        ]
      end

      let(:story) { create(:story, project: project, requested_by: user) }

      let(:story_params) do
        { title: 'Foo', documents: [attachments.first, attachments.last] }
      end

      before do
        attachments.each do |a|
          a.delete('path')
          Story.connection.execute(
            'insert into attachinary_files ' \
            "(#{a.keys.join(', ')}, scope, attachinariable_id, attachinariable_type) " \
            "values ('#{a.values.join("', '")}', 'documents', #{story.id}, 'Story')"
          )
        end
      end

      describe '#update' do
        it 'should have 2 documents' do
          story.reload
          expect(story.documents.count).to eq(2)
        end

        it 'should keep the same 2 documents (the put will delete and reinsert the documents)' do
          VCR.use_cassette('cloudinary_upload') do
            VCR.use_cassette('pusher_notification', match_requests_on: %i[host path]) do
              expect do
                put :update, xhr: true, params: { project_id: project.id, id: story.id, story: story_params }
              end.not_to change { story.reload; story.documents.count }
            end
          end
        end

        it 'should respond with success' do
          VCR.use_cassette('cloudinary_upload_2') do
            VCR.use_cassette('pusher_notification_2', match_requests_on: %i[host path]) do
              put :update, xhr: true, params: { project_id: project.id, id: story.id, story: story_params }
              expect(response).to be_successful
            end
          end
        end

        it 'should delete all documents (resilient against deep_munge rails/rails#13420)' do
          expect(story.documents.count).to eq(2)
          put :update, xhr: true, params: {
            project_id: project.id,
            id: story.id,
            story: { documents: [nil] }
          }
          story.reload
          expect(story.documents.count).to eq(0)
        end
      end
    end

    context 'simulating bug on new story with attachment' do
      let(:received_params) do
        {
          'story' => {
            'events' => nil,
            'documents' => [{
              'public_id' => 'BrunoPassos2_gvwhs5',
              'version' => 1_473_786_081,
              'signature' => '380e170a8d26bbe1a869bd2e00c912141b1c2a35',
              'width' => 1000,
              'height' => 1000,
              'format' => 'jpg',
              'resource_type' => 'image',
              'created_at' => '2016-09-13T17:01:21Z',
              'tags' => %w[development_env attachinary_tmp],
              'bytes' => 690_807,
              'type' =>
              'upload',
              'etag' => '88b961d2a64db1857deba31a8fadcae7',
              'url' => 'http://res.cloudinary.com/hq5e5afno/image/upload/v1473786081' \
                        '/BrunoPassos2_gvwhs5.jpg',
              'secure_url' => 'https://res.cloudinary.com/hq5e5afno/image/upload/v1473786081' \
                              '/BrunoPassos2_gvwhs5.jpg',
              'original_filename' => 'BrunoPassos2'
            }],
            'state' => 'unscheduled',
            'story_type' => 'feature',
            'files' => nil,
            'editing' => true,
            'title' => 'teste'
          },
          'project_id' => project.id
        }
      end

      it 'should create the new story and associate the attachments' do
        VCR.use_cassette('cloudinary_upload', match_requests_on: %i[uri method]) do
          VCR.use_cassette('pusher_notification', match_requests_on: %i[uri method]) do
            expect do
              post :create, xhr: true, params: received_params
            end.to change { Story.count }.by(1)
          end
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

        describe 'when the user create story from the another team session', :aggregate_failures do
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
