require 'rails_helper'

describe StoryOperations::Destroy do
  describe '#call' do
    subject { -> { StoryOperations::Destroy.call(story: story, current_user: user) } }

    let(:membership) { create(:membership) }
    let(:user)        { membership.user }
    let(:project)     { membership.project }
    let(:create_story_params) do
      { title: 'Story', requested_by: user, accepted_at: nil, story_type: 'feature', state: 'started', estimate: 1 }
    end
    let(:story)       { project.stories.create(create_story_params) }

    it 'deletes story' do
      subject.call
      expect { Story.find(story.id) }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'creates activity recording' do
      expect { subject.call }.to change { Activity.count }.by(1)
    end

    it 'returns success' do
      expect(subject.call.success?).to be(true)
    end
  end
end
