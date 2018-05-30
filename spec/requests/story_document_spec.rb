require 'rails_helper'

RSpec.describe 'Story document', type: :request do
  context 'when logged in' do
    let(:user) { create :user, :with_team }
    let!(:project) do
      create(:project, name: 'Test Project', users: [user], teams: [user.teams.first])
    end

    before do
      post user_session_path, user: { email: user.email, password: 'password' }
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
          },
          {
            'id' => 31,
            'public_id' => 'Screen_Shot_2016-08-19_at_09.30.57_blnr1a',
            'version' => '1471624237',
            'format' => 'png',
            'resource_type' => 'image',
          }
        ]
      end

      let(:story) { create(:story, project: project, requested_by: user) }

      before do
        attachments.each do |a|
          Story.connection.execute(
            'insert into attachinary_files ' \
            "(#{a.keys.join(', ')}, scope, attachinariable_id, attachinariable_type) " \
            "values ('#{a.values.join("', '")}', 'documents', #{story.id}, 'Story')"
          )
        end
      end

      it 'should delete all documents (resilient against deep_munge rails/rails#13420)' do
        expect(story.documents.count).to eq(2)
        params = { story: { documents: [] } }.to_json
        headers = { 'CONTENT_TYPE' => 'application/json' }
        
        put project_story_path(project_id: project.id, id: story.id), params, headers
        
        story.reload
        expect(story.documents.count).to eq(0)
      end
    end
  end
end
