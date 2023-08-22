require 'rails_helper'

describe StoryOperations::DestroyAll do
  describe '#call' do
    subject { -> { StoryOperations::DestroyAll.call(stories: stories, current_user: user) } }

    let(:membership)  { create(:membership) }
    let(:user)        { membership.user }
    let(:project)     { membership.project }
    let(:story_1)     { create(:story, project: project, requested_by: user) }
    let(:story_2)     { create(:story, project: project, requested_by: user) }
    let(:story_3)     { create(:story, project: project, requested_by: user) }
    let(:stories_ids) { [story_1, story_2, story_3].map(&:id) }
    let(:stories)     { Story.where(id: stories_ids) }

    it 'deletes stories' do
      subject.call
      expect { Story.find(stories_ids) }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'creates activity recordings' do
      expect { subject.call }.to change { Activity.count }.by(3)
    end

    it 'returns success' do
      expect(subject.call.success?).to be(true)
    end
  end
end
