require 'rails_helper'

describe StoryOperations::UpdateAll do
  describe '#call' do
    subject { -> { StoryOperations::UpdateAll.call(stories: stories, stories_attrs: story_params, current_user: user) } }

    let(:membership)  { create(:membership) }
    let(:user)        { membership.user }
    let(:project)     { membership.project }
    let(:story_1)     { create(:story, project: project, requested_by: user) }
    let(:story_2)     { create(:story, project: project, requested_by: user) }
    let(:story_3)     { create(:story, project: project, requested_by: user) }
    let(:stories_ids) { [story_1, story_2, story_3].map(&:id) }
    let(:stories)     { Story.where(id: stories_ids) }

    context 'with all valid stories' do
      let(:story_params) do
        { title: 'Updated Story', story_type: 'feature', state: 'started', estimate: 1 }
      end

      it 'updates all stories', :aggregate_failures do
        updated_story_1, updated_story_2, updated_story_3 = *subject.call.success

        expect(updated_story_1.title).to eq(story_params[:title])
        expect(updated_story_2.title).to eq(story_params[:title])
        expect(updated_story_3.title).to eq(story_params[:title])
      end

      it 'creates activity recording' do
        expect { subject.call }.to change { Activity.count }.by(3)
      end

      it 'calls StoryOperations::Update', :aggregate_failures do
        expect(StoryOperations::Update).to receive(:call).with(story: story_1, story_attrs: story_params, current_user: user).and_return(double(success?: true))
        expect(StoryOperations::Update).to receive(:call).with(story: story_2, story_attrs: story_params, current_user: user).and_return(double(success?: true))
        expect(StoryOperations::Update).to receive(:call).with(story: story_3, story_attrs: story_params, current_user: user).and_return(double(success?: true))

        subject.call
      end

      it 'sends state changed notification', :aggregate_failures do
        expect(StoryOperations::StateChangeNotification).to receive(:notify_state_changed).with(story_1)
        expect(StoryOperations::StateChangeNotification).to receive(:notify_state_changed).with(story_2)
        expect(StoryOperations::StateChangeNotification).to receive(:notify_state_changed).with(story_3)

        subject.call
      end

      it 'sends user notification', :aggregate_failures do
        expect(StoryOperations::UserNotification).to receive(:notify_users).with(story_1)
        expect(StoryOperations::UserNotification).to receive(:notify_users).with(story_2)
        expect(StoryOperations::UserNotification).to receive(:notify_users).with(story_3)

        subject.call
      end

      it 'returns success' do
        expect(subject.call.success?).to be(true)
      end
    end

    context 'with invalid story title' do
      let(:story_params) do
        { title: '', story_type: 'feature', state: 'started', estimate: 1 }
      end

      it 'does not create activity recordings' do
        expect { subject.call }.to_not change { Activity.count }
      end

      it 'calls StoryOperations::Update', :aggregate_failures do
        expect(StoryOperations::Update).to receive(:call).with(story: story_1, story_attrs: story_params, current_user: user).and_return(double(success?: false))
        expect(StoryOperations::Update).to receive(:call).with(story: story_2, story_attrs: story_params, current_user: user).and_return(double(success?: false))
        expect(StoryOperations::Update).to receive(:call).with(story: story_3, story_attrs: story_params, current_user: user).and_return(double(success?: false))

        subject.call
      end

      it 'does not send state changed notification', :aggregate_failures do
        expect(StoryOperations::StateChangeNotification).to_not receive(:notify_state_changed).with(story_1)
        expect(StoryOperations::StateChangeNotification).to_not receive(:notify_state_changed).with(story_2)
        expect(StoryOperations::StateChangeNotification).to_not receive(:notify_state_changed).with(story_3)

        subject.call
      end

      it 'does not send user notification', :aggregate_failures do
        expect(StoryOperations::UserNotification).to_not receive(:notify_users).with(story_1)
        expect(StoryOperations::UserNotification).to_not receive(:notify_users).with(story_2)
        expect(StoryOperations::UserNotification).to_not receive(:notify_users).with(story_3)

        subject.call
      end

      it 'returns failure' do
        expect(subject.call.failure?).to be(true)
      end
    end
  end
end
