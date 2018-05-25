require 'rails_helper'

describe StoriesController do
  describe 'when logged out' do
    %w[index done backlog in_progress create].each do |action|
      specify do
        get action, project_id: 99
        expect(response).to redirect_to(new_user_session_url)
      end
    end

    %w[show update destroy].each do |action|
      specify do
        get action, project_id: 99, id: 42
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
        xhr :put, :sort, project_id: project.id, ordered_ids: [story2.id, story1.id]
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
        xhr :put, :sort, project_id: project.id, ordered_ids: [story2.id, story1.id]
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
        xhr :put, :sort, project_id: project.id, ordered_ids: [story2.id, story1.id, story3.id]
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
      sign_in user
    end

    describe '#index' do
      let(:stories) { { active_stories: project.stories, past_iterations: [] } }

      specify do
        xhr :get, :index, project_id: project.id
        expect(response).to be_success
        expect(response.body).to eq(stories.to_json)
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
            expect do
              xhr :put, :update, project_id: project.id, id: story.id, story: story_params
            end.to change { story.reload; story.documents.count }.by(0)
            expect(response).to be_success
          end
        end

        it 'should delete all documents (resilient against deep_munge rails/rails#13420)' do
          expect(story.documents.count).to eq(2)
          xhr :put, :update, project_id: project.id, id: story.id, story: ActionDispatch::Request::Utils.deep_munge({ documents: [] })
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
        VCR.use_cassette('cloudinary_upload_new_story') do
          expect do
            xhr :post, :create, received_params
          end.to change { Story.count }.by(1)
        end
      end
    end

    context 'member actions' do
      let(:story) { create(:story, project: project, requested_by: user) }
      let(:story_params) { { title: 'Foo', foo: 'Bar' } }

      describe '#show' do
        specify do
          xhr :get, :show, project_id: project.id, id: story.id
          expect(response).to be_success
          expect(response.body).to eq(story.to_json)
        end
      end

      describe '#update' do
        context 'when update succeeds' do
          specify do
            xhr :get, :update, project_id: project.id, id: story.id, story: story_params
            expect(response).to be_success
            expect(response.body).to eq(assigns[:story].to_json)
          end
        end

        context 'when update fails' do
          specify do
            xhr :get, :update, project_id: project.id, id: story.id, story: { title: '' }
            expect(response.status).to eq(422)
            expect(response.body).to eq(assigns[:story].to_json)
          end
        end
      end

      describe '#destroy' do
        specify do
          xhr :delete, :destroy, project_id: project.id, id: story.id
          expect(response).to be_success
        end
      end

      %w[done backlog in_progress].each do |action|
        describe action do
          specify do
            xhr :get, action, project_id: project.id, id: story.id
            expect(response).to be_success
            expect(response.body).to eq(assigns[:stories].to_json)
          end
        end
      end

      describe '#create' do
        context 'when save succeeds' do
          specify do
            xhr :post, :create, project_id: project.id, story: story_params
            expect(response).to be_success
            expect(response.body).to eq(assigns[:story].to_json)
          end
        end

        context 'when save fails' do
          specify do
            xhr :post, :create, project_id: project.id, story: { title: '' }
            expect(response.status).to eq(422)
            expect(response.body).to eq(assigns[:story].to_json)
          end
        end
      end
    end
  end
end
