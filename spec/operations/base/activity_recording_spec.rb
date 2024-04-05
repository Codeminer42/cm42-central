require 'rails_helper'

describe Base::ActivityRecording do
  def activities_story_ids
    Activity.order(:id).map { |activity| activity[:subject_changes]['id'] }
  end

  let!(:user) { create(:user, :with_team) }
  let!(:project) { create(:project, users: [user], teams: [user.teams.first]) }
  let!(:story) { create(:story, project: project, requested_by: user) }
  let!(:many_stories) { create_list(:story, 3, project: project, requested_by: user) }
  let(:action) { 'destroy' }

  subject { described_class }

  describe '#create_activity' do
    context 'when model is a collection of records' do
      it 'creates an activity for each record' do
        subject.create_activity(many_stories, current_user: user, action: action)
        expect(activities_story_ids).to eq(many_stories.map(&:id))
      end
    end

    context 'when model is a record' do
      it 'creates an activity' do
        subject.create_activity(story, current_user: user, action: action)
        expect(activities_story_ids.first).to eq(story.id)
      end
    end
  end

  describe '#fetch_project' do
    let(:note) { create(:note, story: story) }
    let(:task) { create(:task, story: story) }

    context 'when receive a project' do
      before do
        expect(subject).to receive(:fetch_project).with(project).and_return(project)
      end

      it 'returns the project' do
        subject.create_activity(project, current_user: user, action: action)
      end
    end

    context 'when receive a story' do
      before do
        expect(subject).to receive(:fetch_project).with(story).and_return(project)
      end

      it 'returns the project' do
        subject.create_activity(story, current_user: user, action: action)
      end
    end

    context 'when receive a note' do
      before do
        expect(subject).to receive(:fetch_project).with(note).and_return(project)
      end

      it 'returns the project' do
        subject.create_activity(note, current_user: user, action: action)
      end
    end

    context 'when receive a task' do
      before do
        expect(subject).to receive(:fetch_project).with(task).and_return(project)
      end

      it 'returns the project' do
        subject.create_activity(task, current_user: user, action: action)
      end
    end
  end
end
